const EXPRESS = require("express");
const QUESTIONROUTES = EXPRESS.Router();
const QUESTION = require("../models/question.model");
const TRIP = require("../models/trip.model");
const clientkey = require("../config_yelp").apiKey;
const yelp = require("yelp-fusion");
const client = yelp.client(clientkey);
const tmApiKey = require("../config_tm").tmKey;

QUESTIONROUTES.route("/question").post(function(req, res) {
  //QUESTION
  // console.log(req.body)
  let recs = [];
  let event_list = [];
  const Questions = new QUESTION({
    trip_id: req.body.trip_id,
    user_id: req.body.user_id,
    destination: req.body.destination,
    questions: req.body.questions,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  });
  Questions.save()
    .then(response => {
      /*  client.search({
                term: 'Coffee',
                location: Questions.destination,
            }).then(resp => { */
      // console.log(resp.jsonBody.businesses[0]);
      //TODO: save data to localStorage
      //let recommendations = []

      // for (let i = 0; i < resp.jsonBody.businesses.length; i++) {
      //     console.log("Name: " + resp.jsonBody.businesses[i].name);
      //     console.log("URL: " + resp.jsonBody.businesses[i].url);
      //     console.log("Price: " + resp.jsonBody.businesses[i].price);
      // }
      //  recs = resp.jsonBody.businesses;
      res.status(200).json({
        saved: true,
        response_message: "Question is saved.",
        recs: recs,
        event_list: event_list,
        survey: response
        //   })
      });
      /* .catch(e => {
                console.log(e);
            }); */
    })
    .catch(error => {
      res.status(401).json({
        saved: false,
        response_message: "Error while saving."
      });
    });
});

QUESTIONROUTES.route("/question").get((req, res) => {
  QUESTION.find((err, questions) => {
    if (err) {
      console.log(err);
    } else {
      res.json(questions);
    }
  });
});

QUESTIONROUTES.route("/question/searchlocation").post((req, res) => {
  let b;
  QUESTION.findOne({ trip_id: req.body.trip_id })
    .then(questions => {
      if (questions != null) {
        let term = "";
        if (req.body.search_term.length != 0) {
          term = req.body.search_term;
        }
        client
          .search({
            term: term,
            location: questions.destination
          })
          .then(response => {
            b = response.jsonBody.businesses;

            return TRIP.findOne({ _id: req.body.trip_id });
          })
          .then(res1 => {
            let all_locations = res1.trip_locations;
            for (let i = 0; i < res1.days.length; i++) {
              all_locations = all_locations.concat(res1.days[i]);
            }

            for (let i = 0; i < all_locations.length; i++) {
              for (let j = 0; j < b.length; j++) {
                if (all_locations[i] == undefined) {
                  break;
                }

                if (all_locations[i].id == b[j].id) {
                  b.splice(j, 1);
                  break;
                }
              }
            }

            res.status(200).json({
              questions: questions,
              recs: b,
              eventKey: tmApiKey,
             // startDate: res1.start_date,
             // endDate: res1.end_date,
             // destination: res1.destination,
             trip_id: res1.start_date,
              user_locations: res1.trip_locations,
              add_events: res1.event_locations
            });
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        res.status(400).json({
          questions: null,
          recs: [],
          user_locations: []
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

QUESTIONROUTES.route("/question/:id").delete(function(req, res) {
  QUESTION.findOneAndDelete({ _id: req.params.id }).then(question => {
    if (question != null) {
      res.status(200).json({
        response_message: "Survey deleted!",
        question: question
      });
    } else {
      res.status(400).json({
        trip: null
      });
    }
  });
});

QUESTIONROUTES.route("/question/eventlocation").post((req, res) => {
  let events;
  TRIP.findOne({ _id: req.body.trip_id })
    .then(trips => {
      if (trips != null) {
        let selectStartDate = null;
        let selectEndDate = null;
        const search_dest = trips.destination;
        const startDate = trips.start_date;
        const endDate = trips.end_date;

        console.log("in eventlocation before fetch");

        if ((startDate.getMonth() + 1) < 10 || (startDate.getDate() + 1) < 10){
          if ((startDate.getMonth()+1) < 10 && (startDate.getDate()+1) < 10){
              selectStartDate = ((startDate.getFullYear() + "-" + "0"+ (startDate.getMonth()+1) + "-" + "0" + (startDate.getDate()+1)));
          }
          else if ((startDate.getMonth()+1) < 10 && (startDate.getDate()+1) >= 10){
              selectStartDate = ((startDate.getFullYear() + "-" + "0"+ (startDate.getMonth()+1) + "-" + (startDate.getDate()+1)));
              
          }
          else if ((startDate.getMonth()+1) >=10 && (startDate.getDate()+1) < 10){
              selectStartDate = ((startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + "0" + (startDate.getDate()+1)));
          }
        }
        else{
          selectStartDate = ((startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + (startDate.getDate()+1)));
        }
    
        if ((endDate.getMonth() + 1) < 10 || (endDate.getDate() + 1) < 10){
          if ((endDate.getMonth()+1) < 10 && (endDate.getDate()+1) < 10){
              selectEndDate = ((endDate.getFullYear() + "-" + "0"+ (endDate.getMonth()+1) + "-" + "0" + (endDate.getDate()+1)));
          }
          else if ((endDate.getMonth()+1) < 10 && (endDate.getDate()+1) >= 10){
              selectEndDate = ((endDate.getFullYear() + "-" + "0"+ (endDate.getMonth()+1) + "-" + (endDate.getDate()+1)));
              
          }
          else if ((endDate.getMonth()+1) >=10 && (endDate.getDate()+1) < 10){
              selectEndDate = ((endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + "0" + (endDate.getDate()+1)));
          }
        }
        else{
          selectEndDate = ((endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + (endDate.getDate()+1)));
        }

        const url = "https://app.ticketmaster.com/discovery/v2/events.json?sort=date,asc&startDateTime=" + selectStartDate + "T00:00:00Z&endDateTime=" + selectEndDate + "T00:00:00Z&size=200&radius=75&unit=miles&city=" + search_dest + "&apikey=" + tmApiKey;
        console.log("right before fetch");
        fetch("https://app.ticketmaster.com/discovery/v2/events.json?sort=date,asc&startDateTime=" + selectStartDate + "T00:00:00Z&endDateTime=" + selectEndDate + "T00:00:00Z&size=200&radius=75&unit=miles&city=" + search_dest + "&apikey=" + tmApiKey)
        .then(res1 => res1.json())
        .then(json => {
            let j = 0;
            for (let i = 0; i < json._embedded.events.length; i++){
                events[j] = (json._embedded.events[i]);
                j = j + 1;
            }

            res.status(200).json({
              trip_id: trips.trip_name,
              destination: trips.destination,
              questions: trips.questions,
              start_date: trips.start_date,
              end_date: trips.end_date,
              event_list: events,
              event_locations: events
            });
            console.log("after got response");
        })
        .catch(err => {
            console.log(err);
        });

        res.status(200).json({
          trip_id: trips.trip_name,
          destination: url,
          questions: trips.questions,
          start_date: startDate,
          end_date: endDate,
          event_list: events
        }) 
      } else {
        res.status(400).json({
          trip: null,
          event_locations: []
        })
      }
    })
    .catch(err => {
      console.log(err);
    });
  });

module.exports = QUESTIONROUTES;
