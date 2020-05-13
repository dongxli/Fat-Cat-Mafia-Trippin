const EXPRESS = require("express");
const COMMENTROUTES = EXPRESS.Router();
const COMMENT = require("../models/comment.model");

COMMENTROUTES.route("/comment").post(function (req, res) {
    const C = new COMMENT({
        owner_id: req.body.owner_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_pic: req.body.user_pic,
        trip_id: req.body.trip_id,
        text: req.body.text,
        date: req.body.date,
        commentsOnThisPost: []
    })
    C.save()
        .then(x => {
            console.log(x);
            res.status(200).json({
                saved: true,
                response_message: "Comment created!",
                comment: x
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                saved: false,
                response_message: "Creating comment failed!",
                comment: null
            });
        });
});

COMMENTROUTES.route("/comment/:trip_id").get(function (req, res) {
    COMMENT.find({
        trip_id: req.params.trip_id
    })
        .then(comment => {
            if (comment != null) {
                res.status(200).json({
                    comment: comment
                });
            } else {
                res.status(400).json({
                    comment: null
                });
            }
        });
});

COMMENTROUTES.route("/comment/:_id").put(function (req, res) {
    COMMENT.findByIdAndUpdate(
        { _id: req.params._id },
        {
            $set: { commentsOnThisPost: req.body.commentsOnThisPost }
        }
    )
        .then(response => {
            res.status(200).json({

            });
            console.log(response);
        }).catch(err => {
            console.log(err);
        })
})

COMMENTROUTES.route("/comment/images/:id").put(function (req, res) {
    COMMENT.find(
        { owner_id: req.params.id },
        {
            $set: { user_pic: req.body.image }
        }
    )
        .then(response => {
            res.status(200).json({

            });
            console.log(response);
        }).catch(err => {
            console.log(err);
        })
});



COMMENTROUTES.route("/comment").get(function (req, res) {
    COMMENT.find(function (err, comment) {
        if (err) {
            console.log(err);
        } else {
            res.json(comment);
        }
    });
});


module.exports = COMMENTROUTES;