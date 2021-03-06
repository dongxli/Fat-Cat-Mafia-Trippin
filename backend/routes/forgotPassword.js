const crypto = require("crypto");
const EXPRESS = require("express");
const FORGOTPASSWORDROUTES = EXPRESS.Router();
const USER = require("../models/user.model");
const nodemailer = require("nodemailer");
const cred = require("process");
const sender = require("../sender.js");
require("dotenv").config();

FORGOTPASSWORDROUTES.route("/forgotPassword").post(function (req, res) {
  //console.log("hello");
  if (req.body.email == "") {
    res.status(400).send("email required");
  }
  console.error(req.body.email);
  USER.findOne({ email: req.body.email }).then((user) => {
    if (user == null) {
      console.error("email not in database");
      res.status(403).send("email not in db");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      user
        .update({
          //$addToSet:{
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        })
        .then((y) => {
          console.log(token);
          const transporter = nodemailer.createTransport({
            service: "gmail",
            pool: true,
            host: "smtp.example.com",
            port: 465,
            secure: true,
            auth: {
              user: sender.MAIL_USERNAME,
              pass: sender.MAIL_PASSWORD,
            },
          });

          const mailOptions = {
            from: "Trippin Webapp Service <trippinwebapp@gmail.com>",
            to: `${user.email}`,
            subject: "Link To Reset Password",
            text:
              "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
              "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
              `http://localhost:3000/resetPassword/${token}\n\n` +
              "If you did not request this, please ignore this email and your password will remain unchanged.\n",
          };
          console.log("sending mail");
          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              console.error("there was an error: ", err);
            } else {
              console.log("here is the res: ", response);
              res.status(200).json("recovery email sent");
            }
          });
        });
    }
  });
});
module.exports = FORGOTPASSWORDROUTES;
