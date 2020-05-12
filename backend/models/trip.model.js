const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creating Schema and Model for trip
const tripSchema = new Schema({
  owner_id: String,
  trip_name: String,
  destination: String,
  start_date: Date,
  end_date: Date,
  trip_locations: Array,
  trip_locations_for_scheduling: Array,
  event_locations: Array,
  days: Array,
  buddies: Array,
  posts: Array,
  days_miles: Array,
  polls: [{
    question: String,
    options: [{
      option: String,
      votes: Number
    }]
  }],
  trip_image: String
});

const TripSchem = mongoose.model("tripchar", tripSchema);

module.exports = TripSchem;
