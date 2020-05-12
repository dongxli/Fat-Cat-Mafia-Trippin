const EXPRESS = require("express");
const USERROUTES = EXPRESS.Router();
const db = require("../config_url").mongoURL;
const USER = require("../models/user.model");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const ASYNC = require("async");
const storage = new GridFsStorage({
  url: db,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
//find user by id
USERROUTES.route("/user/:id").get(function (req, res) {
  USER.findOne({ _id: req.params.id }).then((user) => {
    if (user != null) {
      res.status(200).json({
        user: user,
      });
    } else {
      res.status(400).json({
        user: null,
      });
    }
  });
});

//find user by email
USERROUTES.route("/useremail/:email").get(function (req, res) {
  USER.findOne({ email: req.params.email }).then((user) => {
    if (user != null) {
      res.status(200).json({
        user: user,
      });
    } else {
      res.status(400).json({
        user: null,
      });
    }
  });
});

//get all users
USERROUTES.route("/user").get(function (req, res) {
  USER.find(function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

// get users when a list of ids
USERROUTES.route("/user/getusersbylist").post(function (req, res) {
  let users = [];
  ASYNC.eachSeries(
    req.body.list,
    function (id, callback) {
      USER.findById(id)
        .then((r) => {
          users.push(r);
          callback();
        })
        .catch((err) => {
          console.error(err);
          callback();
        });
    },
    function (err) {
      if (err) {
        console.log("error");
      } else {
        // console.log("successful");
        res.status(200).json({
          users: users,
        });
      }
    }
  );
});

USERROUTES.route("/user/:id").put(function (req, res) {
  USER.updateOne(
    { _id: req.params.id },
    {
      $set: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        hometown: req.body.hometown,
        image: req.body.image
      },
    }
  )
    .then((response) => {
      res.status(200).json({});
    })
    .catch((err) => {
      console.log(err);
    });
});

USERROUTES.route("/user/:id/profile").post(
  upload.single("img"),
  (req, res, err) => {
    if (err) throw err;
    USER.updateOne(
      { _id: req.params.id },
      {
        $set: { image: upload.single("img") },
      }
    )
      .then((response) => {
        res.status(200).json({});
      })
      .catch((err) => {
        console.log(err);
      });
    res.status(201).send();
  }
);

USERROUTES.route("/user/:id/profile/:filename").get(function (req, req) {
  USER.findOne({ filename: req.params.filename }, (err, file) => {
    // check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "not an image",
      });
    }
  });
});

USERROUTES.route("/user/delete/:id").delete(function (req, res) {
  USER.findOneAndDelete({ _id: req.params.id }).then((user) => {
    if (user != null) {
      res.status(200).json({
        response_message: "User deleted!",
        user: user,
      });
    } else {
      res.status(400).json({
        user: null,
      });
    }
  });
});

module.exports = USERROUTES;
