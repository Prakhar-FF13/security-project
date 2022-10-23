require("dotenv").config();
const { MongoClient } = require("mongodb"),
  uri = process.env.MONGODB_URI,
  client = new MongoClient(uri);

(async () => {
  await client.connect();
  module.exports.database = client.db("fcsproj");
  module.exports.users = client.db("fcsproj").collection("users");
})();
