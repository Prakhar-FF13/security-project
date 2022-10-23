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
  mongoDB = require("./database");

function isSecure(req) {
  if (req.headers["x-forwarded-proto"]) {
    return req.headers["x-forwarded-proto"] === "https";
  }
  return req.secure;
}

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

app.get("/loginData", async (req, res) => {
  const usersCursor = mongoDB.users.find();
  await usersCursor.forEach(console.dir);
  return res.send("Helo");
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(80);
httpsServer.listen(443);
console.log("Server listining on port [443]");
