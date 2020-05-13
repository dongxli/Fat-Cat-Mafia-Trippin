import React, { Component } from "react";
import "../styles/Home.css";
import MyAccount from "./MyAccount.js";
import Trip from "./Trip.js";
import Footer from "./TrippinPage/footer";

import {
  Alert,
  Button,
  Card,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { element } from "prop-types";
import { app } from "../utils/AxiosConfig";
//const AXIOS = require("axios").default;

let profilePicPath = localStorage.getItem("user");

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      first_name: "",
      last_name: "",
      image: "placeholder.png",
      _v: "",
      hometown: "",
      trip: null,
      trip_id: "",
      trip_number: null,
      trip_list: [],
      all_trip_list: [],
      invite: null,
      invitation_list: [],
      showInvitations: false,
    };

    if (JSON.parse(localStorage.getItem("user")).image == null) {
      this.state = {
        image: "placeholder.png",
      };
    }
  }
  componentDidMount() {
    app
      .get("user/" + JSON.parse(localStorage.getItem("user"))._id)
      .then((response) => {
        this.setState({ email: response.data.user.email });
        this.setState({ first_name: response.data.user.first_name });
        this.setState({ last_name: response.data.user.last_name });
        if (response.data.user.image != null) {
          this.setState({
            image: response.data.user.image,
          });
        }
        if (response.data.user.hometown != null) {
          this.setState({ hometown: response.data.user.hometown });
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    app
      .get("currentdatetrip/" + JSON.parse(localStorage.getItem("user"))._id)
      .then((response) => {
        this.setState({ trip: response.data.trip });
        this.setState({
          trip_list: this.createList(response.data.trip),
        });
        return app.get("trip/" + JSON.parse(localStorage.getItem("user"))._id);
      })
      .then((r) => {
        this.setState({
          all_trip_list: this.createAllList(r.data.trip),
        });
        console.log(r.data.trip);
      });

    app
      .get("buddypending/" + JSON.parse(localStorage.getItem("user"))._id)
      .then((res) => {
        this.setState({
          invite: res.data.tripbuddy,

        });
        this.setState({ invitation_list: this.createInvitations(res.data.tripbuddy) });

      });
  }
  onDeleteFieldClick(e, i) {
    //console.log(i);
    const OneTrip = this.state.trip[i];
    // console.log(OneTrip);
    // console.log(this.state.trip[i]);
    // console.log(JSON.parse(localStorage.getItem('user')))
    const USER_ID = JSON.parse(localStorage.getItem("user"))._id;
    app
      .delete("trip/" + OneTrip._id)
      .then((res) => {
        this.setState({ trip: res.data.trip });
        this.setState({
          trip_list: this.createList(res.data.trip),
        });
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });

    app
      .delete("buddy/" + OneTrip._id)
      .then((res) => { })
      .catch((err) => {
        console.log(err);
      });
  }

  updateLocalTrip(e, i) {
    localStorage.setItem("trip", JSON.stringify(i));
    window.location = "/trip/" + i._id;
  }

  updateLocalTripInvite(e, i) {
    app
      .get("tripid/" + i.trip_id)
      .then((res) => {
        localStorage.setItem("trip", JSON.stringify(res.data.trip[0]));
        window.location = "/trip/" + i.trip_id;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUserEmail(i) {
    app
      .get("user/" + i.owner_id)
      .then((res) => {
        return res.data.user.email;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createInvitationArray(list) {
    console.log(list);
    let array = [];
    for (let i = 0; i < list.length; i++) {
      app.get("tripid/" + list[i].trip_id).then(r => {
        console.log(r);
        array.push({
          owner: `${list[i].owner_first_name} ${list[i].owner_last_name}`,
          trip_id: list[i].trip_id,
          trip_image: r.data.trip[0].trip_image,
          accepted: list[i].accepted,
          denied: list[i].denied,
          pending: list[i].pending,
          owner_id: list[i].owner_id
        })
      })
    }
    return array;
  }

  createInvitations(list) {
    console.log(list);
    let elements = [];
    let trip = {};

    for (let i = 0; i < list.length; i++) {

      if (list[i].pending == true) {
        this.setState({ status: "PENDING" });
      } else {
        if (list[i].accepted == true) {
          this.setState({ status: "ACCEPTED" });
        } else {
          this.setState({ status: "DECLINED" });
        }
      }

      if (list[i].pending == true || list[i].accepted == true) {
        if (list[i].owner_id != JSON.parse(localStorage.getItem('user'))._id) {


          console.log(list[i]);
          elements.push(
            <div className="col-md-3 col-sm-6" key={i}>
              <Card style={{ minWidth: "150px" }}>

                <Card.Header as="h5" style={{ padding: "0", display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={(e) => {
                      this.updateLocalTripInvite(e, list[i]);
                    }}
                    id="linkbtn"
                    className="trip-fonts"
                    style={{
                      textDecoration: "none",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "20px",
                      color: "black",
                      fontWeight: "bold",
                      textTransform: "uppercase",

                    }}
                  >
                    {list[i].trip_name}
                  </Button>
                </Card.Header>
                <Card.Body>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "10px",
                    }}>

                    <label style={{ margin: "auto" }}>
                      <strong>FROM: </strong>
                    </label>
                    <div style={{ display: "flex" }}>
                      <label style={{ margin: "auto" }}>
                        {`${list[i].owner_first_name} ${list[i].owner_last_name}`}
                      </label>

                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ margin: "auto" }}>
                      <strong>STATUS: </strong>
                    </label>
                    <label style={{ margin: "auto" }}>{this.state.status}</label>
                  </div>
                  <Button
                    variant="info"
                    onClick={(e) => {
                      this.updateLocalTripInvite(e, list[i]);
                    }}
                    style={{ display: "block", margin: "20px auto 0 auto" }}
                  >
                    VIEW
                  </Button>
                </Card.Body>
              </Card>
              <div
                className="trip-card"
                style={{
                  margin: "10px 10px 10px 10px",
                }}
              ></div>
            </div>
          );
        }

      }
    }
    if (elements.length > 0) {
      this.setState({ showInvitations: true });
    }
    return elements;
  }
  createAllList(list) {
    let temp = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].trip_image.includes("./images")) {
        list[i].trip_image = "tripimage.jpg"
      }
      let d = new Date(list[i].start_date).toDateString();
      temp.push(
        <div className="col-md-4 col-sm-6 mb-3" key={i}>
          <Card>
            <Card.Img
              variant="top"
              style={{ border: "2px solid gray" }}
              src={`http://fatcatimages.s3.amazonaws.com/${list[i].trip_image}`}

            />
            <Card.Header as="h5">
              {/* <div
                id="linkbtn"
                onClick={(e) => {
                  this.updateLocalTrip(e, list[i]);
                }}
                className="trip-fonts"
                style={{
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                  fontSize: "40px",
                  textAlign: "center",
                }}
              > */}
              {list[i].trip_name}
              {/* </div> */}
            </Card.Header>
            <Card.Body>
              <div className="trip_destination">
                <div>Destination: {list[i].destination}</div>
                <div>Date: {d}</div>
              </div>
              {/* <div
                className="trip-deletion"
                style={{ paddingBottom: "10px" }}
              ></div> */}
            </Card.Body>
            <Card.Footer>
              <Button
                variant="info"
                onClick={(e) => {
                  this.updateLocalTrip(e, list[i]);
                }}
              // style={{ margin: "10px auto" }}
              >
                VIEW
              </Button>
              <Button
                variant="warning"
                style={{ float: "right" }}
                onClick={(e) => {
                  this.onDeleteFieldClick(e, i);
                }}
              >
                Delete
              </Button>
            </Card.Footer>
          </Card>
        </div>
      );
    }

    if (list.length > 0) {
      if (list.length < 4) {
        for (let i = 0; i < 4 - list.length - 1; i++) {
          temp.push(
            <div
              className="col-md-3 col-sm-6"
              style={{ minWidth: "200px" }}
              key={4 - i}
            ></div>
          );
        }
      }
    }
    return temp;
  }

  createList(list) {
    let elements = [];
    const date_mark = new Date();
    date_mark.setDate(date_mark.getDate() + 7);
    let once = false;
    let twice = false;

    let temp = [];
    for (let i = 0; i < list.length; i++) {
      let str = list[i].trip_image;
      if (str.includes("./images")) {
        list[i].trip_image = "tripimage.jpg"
      }
      if (
        once != true &&
        date_mark < new Date(list[i].start_date) &&
        temp.length == 0
      ) {
        date_mark.setDate(date_mark.getDate() + 21);
        once = true;
        temp = [];
      }
      if (once != true && date_mark < new Date(list[i].start_date)) {
        elements.push(
          <div className="container" key="once">
            <h3>Upcoming Week</h3>
            <div className="row">{temp}</div>
          </div>
        );
        date_mark.setDate(date_mark.getDate() + 21);
        once = true;
        temp = [];
      }
      if (
        once == true &&
        twice != true &&
        date_mark < new Date(list[i].start_date) &&
        temp.length == 0
      ) {
        twice = true;
      }
      if (
        once == true &&
        twice != true &&
        date_mark < new Date(list[i].start_date)
      ) {
        elements.push(
          <div className="container" key="twice">
            <h3 className="trip_dates"> Within a Month</h3>
            <div className="row">{temp}</div>
          </div>
        );
        twice = true;
        temp = [];
      }
      let d = new Date(list[i].start_date).toDateString();
      temp.push(
        <div className="col-md-4 col-sm-6 mb-3" key={i}>
          <Card>
            <Card.Img
              variant="top"
              style={{ border: "2px solid gray" }}
              src={`http://fatcatimages.s3.amazonaws.com/${list[i].trip_image}`}

            />
            <Card.Header as="h5">
              {/* <div
                id="linkbtn"
                onClick={(e) => {
                  this.updateLocalTrip(e, list[i]);
                }}
                className="trip-fonts"
                style={{
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "20px",
                  color: "black",
                  fontSize: "40px",
                  textAlign: "center",
                }}
              > */}
              {list[i].trip_name}
              {/* </div> */}
            </Card.Header>
            <Card.Body>
              <div className="trip_destination">
                <div>Destination: {list[i].destination}</div>
                <div>Date: {d}</div>
              </div>
              {/* <div
                className="trip-deletion"
                style={{ paddingBottom: "10px" }}
              ></div> */}
            </Card.Body>
            <Card.Footer>
              <Button
                variant="info"
                onClick={(e) => {
                  this.updateLocalTrip(e, list[i]);
                }}
                style={{ margin: "10px auto" }}
              >
                VIEW
              </Button>
              <Button
                variant="warning"
                style={{ margin: "10px 5px" }}
                onClick={(e) => {
                  this.onDeleteFieldClick(e, i);
                }}
              >
                Delete
              </Button>
            </Card.Footer>
          </Card>
        </div>
      );
    }
    if (list.length > 0) {
      if (list.length < 4) {
        for (let i = 0; i < 4 - list.length - 1; i++) {
          elements.push(
            <div
              className="col-md-3 col-sm-6"
              style={{ minWidth: "200px" }}
              key={4 - i}
            ></div>
          );
        }
      }
      if (once == false) {
        elements.push(
          <div className="container" key="once">
            <h3>Upcoming Week</h3>
            <div className="row">{temp}</div>
          </div>
        );
      } else if (twice == false) {
        elements.push(
          <div className="container" key="twice">
            <h3 className="trip_dates">Within a Month</h3>
            <div className="row">{temp}</div>
          </div>
        );
      } else if (twice == true && once == true && temp.length != 0) {
        elements.push(
          <div className="container" key="third">
            <h3 className="trip_dates">Rest of My Upcoming Trips</h3>
            <div className="row">{temp}</div>
          </div>
        );
      }
    }
    return elements;
  }
  render() {
    const img = this.state.image;
    return (
      <div style={{ height: "100%" }}>
        <div
          className="image-container"
          style={{
            minHeight: "100%",
            // backgroundImage:
            // "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
            // backgroundImage:
            //   "url(https://wallpaperscute.com/wp-content/uploads/2019/05/Sunset-Wallpaper-For-Desktop.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            paddingBottom: "50px",
            // backgroundPosition: "center",
            // backgroundAttachment: "fixed",
            // overflow: "auto",
            // display: "flex",
          }}
        >
          <div style={{ height: "100%", display: "flex", width: "100%" }}>
            <Card
              style={{
                height: "60%",
                margin: "3%",
                // borderRadius: "5px",
                // border: "2px solid gray",
                boxSizing: "border-box",
                // borderRadius: "20px",
                // boxShadow: "8px 8px 50px #000",
                // color: "#6c757d",
              }}
            >
              <Card.Body>
                <div style={{ display: "flex", alignContent: "center" }}>
                  <img
                    alt="profile"
                    className="responsive"
                    src={`http://fatcatimages.s3.amazonaws.com/${this.state.image}`}
                    style={{
                      display: "block",
                      margin: "5px auto",
                      width: "150px",
                      border: "1px solid black",
                    }}
                  />
                  {/* <ProfilePicture /> */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      margin: "5px ",
                    }}
                  >
                    <label
                      id="same-line"
                      style={{
                        marginRight: "5px",
                      }}
                    >
                      <strong>NAME: </strong>
                    </label>
                    <label>{`  ${this.state.first_name}  ${this.state.last_name}`}</label>
                  </div>
                  <div
                    style={{
                      margin: "5px ",
                    }}
                  >
                    <label
                      id="same-line"
                      style={{
                        marginRight: "5px",
                      }}
                    >
                      <strong>HOMETOWN: </strong>
                    </label>
                    <label>{`${this.state.hometown}`}</label>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <Button
                    style={{ margin: "5px 5px" }}
                    variant="outline-success"
                    id="home-btns"
                    href="/Friends"
                  >
                    VIEW FRIENDS
                  </Button>
                  <Button
                    style={{ margin: "5px 5px" }}
                    variant="outline-primary"
                    id="home-btns"
                    href="/Trip"
                  >
                    CREATE A TRIP
                  </Button>
                </div>
              </Card.Body>
            </Card>
            <div
              style={{
                disply: "flex",
                flexDirection: "column",
                marginTop: "3%",
                width: "50%",
              }}
            >
              {this.state.invitation_list.length == 0 &&
                this.state.trip_list.length == 0 &&
                this.state.all_trip_list.length == 0 ? (
                  <Card
                    className="tripContainerBorder"
                    style={{ height: "400px" }}
                  >
                    <h3 style={{ margin: "0 auto", paddingTop: "175px" }}>
                      No trips yet!
                  </h3>
                  </Card>
                ) : (
                  ""
                )}
              <Alert show={this.state.showInvitations}>
                <Card
                  className="tripContainerBorder"
                  style={{
                    marginBottom: "20px",
                    // margin: "3%",
                    // borderRadius: "5px",
                    // border: "2px solid gray",
                    // boxSizing: "border-box",
                    // borderRadius: "20px",
                    // boxShadow: "8px 8px 50px #000",
                    // color: "#6c757d",
                  }}
                >
                  <Card.Header as="h4" style={{ padding: "20px" }}>
                    TRIP INVITATIONS
                  </Card.Header>
                  <Card.Body>
                    <div className="row">{this.state.invitation_list}</div>
                  </Card.Body>
                </Card>
              </Alert>
              {this.state.trip_list.length != 0 ? (
                <Card
                  className="tripContainerBorder"
                  style={{
                    marginBottom: "50px",
                    // margin: "3%",
                    // borderRadius: "5px",
                    // border: "2px solid gray",
                    // boxSizing: "border-box",
                    // borderRadius: "20px",
                    // boxShadow: "8px 8px 50px #000",
                    // color: "#6c757d",
                  }}
                >
                  <Card.Header as="h4">UPCOMING TRIPS</Card.Header>
                  <Card.Body className="row">{this.state.trip_list}</Card.Body>
                </Card>
              ) : (
                  ""
                )}
              {this.state.all_trip_list.length != 0 ? (
                <Card
                  className="tripContainerBorder"
                  style={
                    {
                      // margin: "3%",
                      // borderRadius: "5px",
                      // border: "2px solid gray",
                      // boxSizing: "border-box",
                      // borderRadius: "20px",
                      // boxShadow: "8px 8px 50px #000",
                      // color: "#6c757d",
                    }
                  }
                >
                  <Card.Header as="h4">ALL MY TRIPS</Card.Header>
                  <Card.Body className="row">
                    {this.state.all_trip_list}
                  </Card.Body>
                </Card>
              ) : (
                  ""
                )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
