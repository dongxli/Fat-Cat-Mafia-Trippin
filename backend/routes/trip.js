const EXPRESS = require("express");
const TRIPROUTES = EXPRESS.Router();
const TRIP = require("../models/trip.model");
const USER = require("../models/user.model");
const REQUEST = require("request");
const ASYNC = require("async");
const GOOGLE_KEY = require("../config_google").key;
const FRIEND = require("../models/friend.model");
const TRIPBUDDY = require("../models/tripbuddy.model");

TRIPROUTES.route("/trip").post(function (req, res) {
  const T = new TRIP({
    owner_id: req.body.owner_id,
    trip_name: req.body.trip_name,
    destination: req.body.destination,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    days: req.body.days,
    buddies: [req.body.owner_id],
    posts: req.body.posts,
    polls: req.body.polls,
    trip_image: "tripimage.jpg",
  });
  T.save()
    .then((x) => {
      const B = new TRIPBUDDY({
        owner_id: req.body.owner_id,
        trip_id: x._id,
        trip_name: req.body.trip_name,
        buddy_id: req.body.user._id,
        buddy_first_name: req.body.user.first_name,
        buddy_last_name: req.body.user.last_name,
        buddy_picture: req.body.user.image,
        owner_first_name: req.body.user.first_name,
        owner_last_name: req.body.user.last_name,
        accepted: true,
        denied: false,
        pending: false,
      });

      B.save().then((y) => {
        res.status(200).json({
          saved: true,
          response_message: "Trip created!",
          trip: x,
        });
      });
    })
    .catch((err) => {
      //   console.error(err);
      res.status(200).json({
        saved: false,
        response_message: "Creating trip failed!",
        trip: null,
      });
    });
});

TRIPROUTES.route("/trip/addbuddy").post(function (req, res) {
  FRIEND.findOne({ owner_id: req.body.owner_id }).then((user) => {
    let friends = user.confirmed_friends;
    if (friends.email == req.body.buddy) {
    }
  });
});

TRIPROUTES.route("/trip/:id").get(function (req, res) {
  TRIP.find({ owner_id: req.params.id }).then((trip) => {
    if (trip != null) {
      res.status(200).json({
        trip: trip,
      });
    } else {
      res.status(400).json({
        trip: null,
      });
    }
  });
});

TRIPROUTES.route("/trip/:id").put(function (req, res) {
  TRIP.find({ owner_id: req.params.id }).then((trip) => {
    if (trip != null) {
      res.status(200).json({
        trip: trip,
      });
    } else {
      res.status(400).json({
        trip: null,
      });
    }
  });
});

TRIPROUTES.route("/currentdatetrip/:id").get(function (req, res) {
  TRIP.find({ owner_id: req.params.id, start_date: { $gte: new Date() } })
    .sort({ start_date: 1 })
    .then((trip) => {
      if (trip != null) {
        res.status(200).json({
          trip: trip,
        });
      } else {
        res.status(400).json({
          trip: null,
        });
      }
    });
});

TRIPROUTES.route("/tripid/:id").get(function (req, res) {
  TRIP.find({ _id: req.params.id }).then((trip) => {
    if (trip != null) {
      res.status(200).json({
        trip: trip,
      });
    } else {
      res.status(400).json({
        trip: null,
      });
    }
  });
});

TRIPROUTES.route("/trip/:id").delete(function (req, res) {
  TRIP.findOneAndDelete({ _id: req.params.id }).then((trip) => {
    if (trip != null) {
      res.status(200).json({
        response_message: "Trip deleted!",
        trip: trip,
      });
    } else {
      res.status(400).json({
        trip: null,
      });
    }
  });
});

// add a location to user's list
TRIPROUTES.route("/trip/addtotriplocation").post(function (req, res) {
  // console.log(req.body);
  TRIP.findOneAndUpdate(
    { _id: req.body.trip_id },
    {
      $addToSet: { trip_locations: req.body.trip_location, event_locations: req.body.trip_location_events },
    },
    {
      returnOriginal: false,
    }
  ).then((trip) => {
    if (trip != null) {
      res.status(200).json({
        updated: true,
        trip: trip,
      });
    } else {
      res.status(400).json({
        updated: false,
        trip: null,
      });
    }
  });
});

// delete a location from user's list
TRIPROUTES.route("/trip/deletefromtriplocations").post(function (req, res) {
  TRIP.findOneAndUpdate(
    { _id: req.body.trip_id },
    {
      $pull: { trip_locations: req.body.trip_location },
    },
    {
      returnOriginal: false,
    }
  ).then((trip) => {
    if (trip != null) {
      res.status(200).json({
        updated: true,
        trip: trip,
      });
    } else {
      res.status(400).json({
        updated: false,
        trip: null,
      });
    }
  });
});

TRIPROUTES.route("/tripinfo/updateschedule").post(function (req, res) {
  TRIP.findOneAndUpdate(
    { _id: req.body.trip_id },
    { days: req.body.days, trip_locations: req.body.trip_locations },
    { returnOriginal: false }
  ).then((r) => {
    const milage = [];
    const urls = [];
    for (let i = 0; i < r.days.length; i++) {
      let day_length = r.days[i].length;
      let day = r.days[i];
      let origin = "";
      let destination = "";
      let waypoints = [];
      if (day_length <= 1) {
        urls.push(null);
        continue;
      }
      for (let j = 0; j < day_length; j++) {
        let loc = day[j].location;
        let temploc =
          loc.address1 + " " + loc.city + " " + loc.state + " " + loc.zip_code;
        if (j == 0) {
          origin = temploc;
        } else if (j + 1 == day_length) {
          destination = temploc;
        } else {
          waypoints.push(temploc);
        }
      }
      let waypoints_string = "&waypoints=";
      if (waypoints.length != 0) {
        for (let i = 0; i < waypoints.length; i++) {
          if (i != 0) {
            waypoints_string += "|" + waypoints[i];
          } else {
            waypoints_string += waypoints[i];
          }
        }
      }

      let origin_string = "origin=" + origin;
      let destination_string = "&destination=" + destination;
      let url =
        "https://maps.googleapis.com/maps/api/directions/json?" +
        origin_string +
        destination_string +
        waypoints_string +
        "&key=" +
        GOOGLE_KEY;
      urls.push(url);
    }
    ASYNC.eachSeries(
      urls,
      function (url, callback) {
        if (url == null) {
          milage.push(0);
          callback();
        } else {
          REQUEST(url, function (error, response, body) {
            if (error) {
              milage.push("Error");
              callback();
            } else {
              let legs = JSON.parse(body).routes[0].legs;
              let meters = 0;
              for (let j = 0; j < legs.length; j++) {
                meters += legs[j].distance.value;
              }
              // console.log(JSON.parse(body));
              milage.push(meters * 0.000621371192);
              callback();
            }
          });
        }
      },
      function (err) {
        if (err) {
          console.log("error for distance calculation");
        } else {
          console.log("successfully computed distance");

          TRIP.findOneAndUpdate(
            { _id: req.body.trip_id },
            { days_miles: milage },
            { returnOriginal: false }
          )
            .then((x) => {
              res.status(200).json({
                trip: x,
              });
            })
            .catch();
        }
      }
    );
  });
});

TRIPROUTES.route("/tripinfo/addtodays").post(function (req, res) {
  TRIP.findOneAndUpdate(
    { _id: req.body.trip_id },
    { days: req.body.days },
    { returnOriginal: false }
  ).then((r) => {
    res.status(200).json({ days: r.days });
  });
});

TRIPROUTES.route("/tripinfo/addBuddy").post(function (req, res) {
  TRIP.findOneAndUpdate(
    { _id: req.body.trip_id },
    { buddies: req.body.buddies }
  ).then((r) => {
    res.status(200).json({ buddies: r.buddies });
  });
});

// get trip information based on trip id
TRIPROUTES.route("/tripinfo/:trip_id").get(function (req, res) {
  TRIP.findOne({ _id: req.params.trip_id }).then((trip) => {
    if (trip != null) {
      res.status(200).json({
        // updated: true,
        trip: trip,
      });
    } else {
      res.status(400).json({
        // updated: false,
        trip: null,
      });
    }
  });
});

TRIPROUTES.route("/trip/:_id").put(function (req, res) {
  TRIP.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: { buddies: req.body.buddies },
    }
  )
    .then((response) => {
      res.status(200).json({});
    })
    .catch((err) => {
      console.log(err);
    });
});

TRIPROUTES.route("/trippoll/:_id").put(function (req, res) {
  TRIP.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: { polls: req.body.polls },
    }
  )
    .then((response) => {
      res.status(200).json({});
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = TRIPROUTES;
