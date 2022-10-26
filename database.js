require("dotenv").config();
const mongodb = require("mongodb"),
  Grid = require("gridfs-stream"),
  util = require("util"),
  uri = process.env.MONGODB_URI,
  client = new mongodb.MongoClient(uri),
  multer = require("multer"),
  { GridFsStorage } = require("multer-gridfs-storage");

(async () => {
  await client.connect();
  const database = client.db("fcsproj"),
    users = client.db("fcsproj").collection("users"),
    uploads = new mongodb.GridFSBucket(database, { bucketName: "uploads" }),
    storage = new GridFsStorage({
      url: uri,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) => {
        return {
          bucketName: "uploads",
          filename: `${req.user._id.toString()}-${file.originalname}`,
        };
      },
    }),
    uploadFiles = multer({ storage }).array("file"),
    uploadFilesMiddleware = util.promisify(uploadFiles),
    upload = async (req, res) => {
      try {
        await uploadFilesMiddleware(req, res);
        for (let i = 0; i < req.files.length; i++) {
          await users.findOneAndUpdate(
            { _id: req.user._id },
            {
              $push: {
                files: {
                  contentType: req.files[i].contentType,
                  id: req.files[i].id.toString(),
                  filename: req.files[i].filename,
                  mimetype: req.files[i].mimetype,
                },
              },
            }
          );
        }

        return res.send({
          message: "File has been uploaded.",
        });
      } catch (error) {
        console.log(error);
        return res.send({
          message: `Error when trying upload image: ${error}`,
        });
      }
    },
    getListFiles = async (req, res) => {
      try {
        const data = database.collection("uploads.files");
        const cursor = data.find({
          filename: {
            $in: req.user.files,
          },
        });

        if ((await cursor.count()) === 0) {
          return res.status(500).send({
            message: "No files found!",
          });
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
          fileInfos.push({
            name: doc.filename,
            url: "/fetch" + doc.filename,
          });
        });

        return res.status(200).send(fileInfos);
      } catch (error) {
        return res.status(500).send({
          message: error.message,
        });
      }
    },
    download = async (req, res) => {
      try {
        let downloadStream = uploads.openDownloadStream(
          new mongodb.ObjectId(req.params.id)
        );

        res.set({
          "Content-Disposition": 'attachment; filename="' + req.params.id + '"',
          "Content-Type": req.params.type,
        });

        downloadStream.on("data", function (data) {
          return res.status(200).write(data);
        });
        downloadStream.on("error", function (err) {
          return res.status(404).send({ message: "Cannot download the file!" });
        });
        downloadStream.on("end", () => {
          return res.end();
        });
      } catch (error) {
        return res.status(500).send({
          message: error.message,
        });
      }
    };

  await users.deleteMany({});
  const fileCursor = database.collection("uploads.files").find({});
  if ((await fileCursor.count()) !== 0) {
    await fileCursor.forEach((doc) => {
      uploads.delete(doc._id);
    });
  }

  module.exports.database = database;
  module.exports.users = users;
  module.exports.upload = upload;
  module.exports.getListFiles = getListFiles;
  module.exports.download = download;
})();
