const express = require("express"),
  fs = require("fs"),
  path = require("path"),
  http = require("http"),
  cors = require("cors"),
  https = require("https"),
  app = express(),
  options = {
    key: fs.readFileSync("./cert/key.pem", { encoding: "utf-8" }),
    cert: fs.readFileSync("./cert/certificate.pem", { encoding: "utf-8" }),
  },
  mongoDB = require("./database"),
  passport = require("passport"),
  utils = require("./utils");

require("./passport")(passport);

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

app.use(express.static(path.join(__dirname, "build")));

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

app.post("/register", (req, res) => {
  const saltHash = utils.genPassword(req.body.password),
    salt = saltHash.salt,
    hash = saltHash.hash;

  mongoDB.users.insertOne(
    {
      username: req.body.username,
      type: req.body.type,
      hash,
      salt,
    },
    (err, result) => {
      if (err) {
        return res.json(err);
      }
      const jwt = utils.issueJWT(result);
      return res.json({
        success: true,
        token: jwt.token,
        expiresIn: jwt.expires,
        user: result,
      });
    }
  );
});

app.post("/login", (req, res) => {
  mongoDB.users.findOne({ username: req.body.username }, function (err, user) {
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

    if (isValid) {
      const token = utils.issueJWT(user);
      return res.status(200).json({
        success: true,
        token,
        expiresIn: token.expires,
        user: user,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Password not valid",
    });
  });
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(80);
httpsServer.listen(443);
console.log("Server listining on port [443]");
