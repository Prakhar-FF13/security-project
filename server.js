const express = require("express"),
  fs = require("fs"),
  path = require("path"),
  http = require("http"),
  https = require("https"),
  app = express(),
  options = {
    key: fs.readFileSync("./cert/key.pem", { encoding: "utf-8" }),
    cert: fs.readFileSync("./cert/certificate.pem", { encoding: "utf-8" }),
  };

app.use(express.static(path.join(__dirname, "build")));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.get("*", (req, res) => {
  res.redirect("https://" + req.headers.host + req.url);
});

httpServer.listen(3001);
httpsServer.listen(3000);
console.log("Server listining on port [3000]");
