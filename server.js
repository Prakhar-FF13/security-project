const express = require("express"),
  fs = require("fs"),
  path = require("path"),
  http = require("http"),
  cors = require("cors"),
  https = require("https"),
  crypto = require("crypto"),
  app = express(),
  options = {
    key: fs.readFileSync("./cert/key.pem", { encoding: "utf-8" }),
    cert: fs.readFileSync("./cert/certificate.pem", { encoding: "utf-8" }),
  },
  mongoDB = require("./database"),
  passport = require("passport"),
  utils = require("./utils");

require("./passport")(passport);

/**************************************
 * Pub/priv key for user to generate digital signature.
 **************************************/

function genKeyPairU() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });

  return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey };
}

/**************************************
 * Symmetric key algorithm below.
 **************************************/

const algorithm = "aes-256-cbc";
const IV_LENGTH = 16;

const symmetricEncrypt = (text) => {
  const key = fs.readFileSync("./cryptography/id_sym_key.pem", {
    encoding: "utf-8",
  });
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

// check if https connection is made or not.
function isSecure(req) {
  if (req.headers["x-forwarded-proto"]) {
    return req.headers["x-forwarded-proto"] === "https";
  }
  return req.secure;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// redirect any page form http to https
app.use((req, res, next) => {
  if (!isSecure(req)) {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

// front end files.
app.use(express.static(path.join(__dirname, "build")));

// testing purproses api.
app.post(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "authorized",
    });
  }
);

// upload files into mongoDB.
app.post(
  "/upload_files",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    req.fileOrigin = "upload";
    return await mongoDB.upload(req, res);
  }
);

app.post(
  "/share",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await mongoDB.users.updateOne(
      {
        _id: req.user._id,
      },
      {
        $push: {
          sent: {
            origin: "sharedWith",
            id: req.body.payload.id,
            sendTo: req.body.sendTo,
          },
        },
      }
    );

    await mongoDB.users.updateOne(
      {
        email: req.body.sendTo,
      },
      {
        $push: {
          received: {
            origin: "received",
            ...req.body,
            receivedFrom: req.user.email,
            receivedFromId: req.user._id,
          },
        },
      }
    );

    return res.status(201).send({
      message: "Shared the file",
    });
  }
);

app.get(
  "/fetch_shared_files",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const data = await mongoDB.users.findOne({ _id: req.user._id });
    return res.status(200).send(data.sent);
  }
);

app.get(
  "/fetch_received_files",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const data = await mongoDB.users.findOne({ _id: req.user._id });

    return res.status(200).send(data.received);
  }
);

app.get(
  "/fetch_files/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    return await mongoDB.download(req, res);
  }
);

// fetch all files from mongoDB.
app.get(
  "/fetch_files",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    return await mongoDB.getListFiles(req, res);
  }
);

app.post(
  "/verify_file",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    return await mongoDB.verifyFile(req, res);
  }
);

// register user.
app.post("/register", (req, res) => {
  const saltHash = utils.genPassword(req.body.password),
    salt = saltHash.salt,
    hash = saltHash.hash,
    keyPairU = genKeyPairU(),
    pubKeyU = keyPairU.publicKey,
    privKeyUEnc = symmetricEncrypt(keyPairU.privateKey);

  mongoDB.users.insertOne(
    {
      email: req.body.email,
      type: req.body.type,
      hash,
      salt,
      kind: req.body.kind,
      wallet: req.body.wallet,
      verified: false,
      files: [],
      pubKey: pubKeyU,
      privKeyEnc: privKeyUEnc,
    },
    (err, result) => {
      if (err) {
        return res.json(err);
      }
      const jwt = utils.issueJWT({ _id: result.insertedId.toString() });
      return res.json({
        success: true,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    }
  );
});

// login user.
app.post("/login", (req, res) => {
  mongoDB.users.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Could not find user",
      });
    }

    const isValid = utils.validPassword(
      req.body.password,
      user.hash,
      user.salt
    );

    delete user.hash;
    delete user.salt;
    delete user.pubKey;
    delete user.privKeyEnc;

    if (isValid) {
      const token = utils.issueJWT(user);
      return res.status(200).json({
        success: true,
        token,
        expiresIn: token.expires,
        user,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Password not valid",
    });
  });
});


app.post(
  "/walletpay",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const data = await mongoDB.users.updateOne(
      {
        _id: req.user._id,
      },
      {
        $set: {"wallet": req.body.wallet}
      }
    );
    const fetchedData = await mongoDB.users.findOne(
      {
        _id: req.user._id,
      },
    );
    return res.status(200).send(fetchedData.wallet);
  }
);


app.post(
  "/walletadd",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const data = await mongoDB.users.updateOne(
      {
        _id: req.user._id,
      },
      {
        $set: {"wallet": req.body.wallet}
      }
    );
    const fetchedData = await mongoDB.users.findOne(
      {
        _id: req.user._id,
      },
    );
    return res.status(200).send(fetchedData.wallet);
  
  }
);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(80);
httpsServer.listen(443);
console.log("Server listining on port [443]");
