require("dotenv").config();
const mongodb = require("mongodb"),
  uri = process.env.MONGODB_URI,
  client = new mongodb.MongoClient(uri),
  multer = require("multer"),
  { GridFsStorage } = require("multer-gridfs-storage");

(async () => {
  await client.connect();
  const database = client.db("fcsproj"),
    users = client.db("fcsproj").collection("users"),
    uploads = new mongodb.GridFSBucket(database, { bucketName: "uploads" });

  module.exports.database = database;
  module.exports.users = users;
  module.exports.uploads = uploads;
})();
