import React, { Component } from "react";
import "../styles/Trip.css";
import { Survey } from "./Survey";
import { Button, ButtonToolbar, Form, Col, Row, Card } from "react-bootstrap";
import { app } from "../utils/AxiosConfig";
//const AXIOS = require("axios").default;

export class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner_id: "",
      destination: "",
      start_date: null,
      end_date: null,
      addSurveyShow: false,
    };
  }
  componentDidMount() {
    app
      .get("trip/" + JSON.parse(localStorage.getItem("user"))._id)
      .then((res) => {
        this.setState({ trip: res.data.trip });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // new Date("dateString") is browser-dependent and discouraged, so we'll write
  // a simple parse function for U.S. date format (which does no error checking)
  parseDate(str) {
    var mdy = str.split("-");
    return new Date(mdy[0], mdy[1] - 1, mdy[2]);
  }

  datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  onCreateFieldClick = (e) => {
    e.preventDefault();
    var x = document.getElementById("arrival_location").value;
    var y = document.getElementById("start-day").value;
    var z = document.getElementById("end-day").value;
    var w = document.getElementById("trip-name").value;

    let numOfDays = (this.datediff(this.parseDate(y), this.parseDate(z))) + 1;
    let days = [];
    for (let i = 1; i <= numOfDays; i++) {
      days.push([]);
    }

    const update = {
      owner_id: JSON.parse(localStorage.getItem("user"))._id,
      //    email: JSON.parse(localStorage.getItem('user')).email,
      destination: x,
      start_date: y,
      end_date: z,
      trip_name: w,
      days: days,
      user: JSON.parse(localStorage.getItem("user")),
    };
    app
      .post("trip/", update)
      .then((res) => {
        localStorage.setItem("trip", JSON.stringify(res.data.trip));

        this.setState({ addSurveyShow: true });
      })
      .catch((err) => {
        console.log(err);
      });
    // e.preventDefault();
    window.location = "Survey";
  };
  render() {
    let addSurveyClose = () => this.setState({ addSurveyShow: false });
    return (
      <div
        className="iContainer"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "auto",
          height: "100%",
        }}
      >
        <div
          className="containerBorder"
          style={{
            width: "400px",
            // borderRadius: "5px",
            width: "500px",
            margin: "100px auto",
            // border: "1px solid transparent",
            // boxSizing: "border-box",
            // borderRadius: "20px",
            // boxShadow: "8px 8px 50px #000",
            // color: "#6c757d",
            color: "#3a3e42",
          }}
        >
          <Card
            style={
              {
                // border: "transparent",
                // borderRadius: "20px",
                // backgroundColor: "white"
              }
            }
          >
            <Card.Body>
              <Card.Title className="text-center">Create a Trip</Card.Title>
              <form className="form-trip" onSubmit={this.onCreateFieldClick}>
                <div className="form-label-group">
                  <input
                    type="text"
                    className="form-control"
                    id="trip-name"
                    placeholder="Trip Name"
                    required
                    style={{
                      width: "100%",
                      // backgroundColor: "white",
                      border: "1px solid #CED4DA",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                    }}
                  />
                  <label htmlFor="trip-name" style={{ color: "#6c757d" }}>
                    Trip Name
                  </label>
                </div>
                <div className="form-label-group">
                  <input
                    type="text"
                    className="form-control"
                    id="arrival_location"
                    placeholder="Destination"
                    required
                    style={{
                      width: "100%",
                      // backgroundColor: "white",
                      border: "1px solid #CED4DA",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                    }}
                  />
                  <label
                    htmlFor="arrival_location"
                    style={{ color: "#6c757d" }}
                  >
                    Destination
                  </label>
                </div>
                <div className="form-label-group">
                  <input
                    type="date"
                    className="form-control"
                    id="start-day"
                    placeholder="startdate"
                    required
                    style={{
                      width: "100%",
                      // backgroundColor: "white",
                      textAlign: "center",
                      border: "1px solid #CED4DA",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                      paddingLeft: "15%"
                    }}
                  />
                  <label htmlFor="startdate" style={{ color: "#6c757d" }}>
                    Start Date
                  </label>
                </div>
                <div className="form-label-group">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="enddate"
                    required
                    style={{
                      width: "100%",
                      // backgroundColor: "white",
                      border: "1px solid #CED4DA",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                      textAlign: "center",
                      paddingLeft: "15%"
                    }}
                    id="end-day"
                  />
                  <label htmlFor="enddate" style={{ color: "#6c757d" }}>
                    End Date
                  </label>
                </div>
                <ButtonToolbar>
                  <button
                    className="btn btn-lg btn-primary btn-block text-uppercase"
                    type="submit"
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      backgroundColor: "#4a7199",
                      color: "#fff",
                    }}
                  // onClick={
                  // this.onCreateFieldClick()
                  // }
                  >
                    Create
                  </button>
                  {/*<Survey
                  //  show={this.state.addSurveyShow}
                  //  onHide={addSurveyClose}
                  //  handler={this.handler}
                  />*/}
                </ButtonToolbar>

                {/* <button
                  className="btn btn-lg btn-primary btn-block text-uppercase"
                  type="submit"
                  style={{ backgroundColor: "transparent" }}
                >
                  Create
                </button> */}
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default Trip;
