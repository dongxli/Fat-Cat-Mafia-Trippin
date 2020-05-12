import React, { Component } from "react";
import { Card, Form, ListGroup, Nav, Tab, Tabs, Toast } from "react-bootstrap";
import { Collapse } from 'reactstrap';
import Button from "react-bootstrap/Button";
import "../styles/Friends.css";
import "../styles/Trip.css";
import "../styles/CurrentTrip.css";
import AXIOS from "axios";
import InviteBuddy from "./InviteBuddy";
import InviteDriver from "./InviteDriver";
import Poll from "react-polls";
import { app } from "../utils/AxiosConfig";
import Footer from "./TrippinPage/footer";
import { ReactComponent as Calendar } from "./images/calendar.svg";

class CurrentTrip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trip_id: this.props.match.params.id,
      start: null,
      end: null,
      trip: {},
      posts: [],
      comment_id: "",
      user_id: "",
      comment: "",
      comment_date: "",
      user: {},

      show_drivers: false,
      all_candidates: [],
      candidates: [],
      all_drivers: [],
      drivers: [],
      all_driver_passengers: [],
      driver_passengers: [],
      driver_number: "0",
      inviteBuddyShow: false,
      options: [],
      pollValidated: false,

      email_success: false,
      show_email_notification: false,

      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      option5: "",
      polls: [],
      trip_image: "tripimage.jpg",

      showInviteButton: true,
      showMulterPanel: false
    };
  }

  componentDidMount() {
    app
      .get("tripid/" + this.state.trip_id)
      .then((result) => {
        // if (result.data.trip.start_date != null)
        this.setState({
          start: result.data.trip[0].start_date.substring(0, 10),
        });
        this.setState({ end: result.data.trip[0].end_date.substring(0, 10) });
        this.setState({ trip: result.data.trip[0] });
        // console.log(JSON.parse(localStorage.getItem('trip')).trip_image)
        if (result.data.trip[0].trip_image !== undefined && !(result.data.trip[0].trip_image.includes("./images"))) {
          this.setState({ trip_image: result.data.trip[0].trip_image });
        }
        else {
          this.setState({ trip_image: "tripimage.jpg" });
        }
        if (
          result.data.trip[0].owner_id ===
          JSON.parse(localStorage.getItem("user"))._id
        ) {
          this.setState({ showInviteButton: false });
        }

        return app.get("user/" + this.state.trip.owner_id);
      })
      .then((response) => {
        this.setState({ organizer: this.getTripOrganizer(response.data.user) });
      });
    // get trip info
    app.get("comment/" + this.state.trip_id).then((response) => {
      if (response !== undefined && response.data.comment.length != 0) {
        this.setState({ comment_id: response.data.comment[0]._id });
        this.setState({ comment: response.data.comment[0].text });
        this.setState({ comment_date: response.data.comment[0].date });
        this.setState({ posts: this.createPostCards(response.data.comment) });
      }
    });

    //check if any pending invitations
    app.get("buddy/" + this.state.trip_id).then((respo) => {
      let invitations = respo.data.tripbuddy;
      this.getTripBuddies(invitations);
      for (let i = 0; i < invitations.length; i++) {
        if (
          invitations[i].buddy_id ===
          JSON.parse(localStorage.getItem("user"))._id
        ) {
          if (invitations[i].pending === true) {
            this.setState({ invitation: this.createInvitation() });
            localStorage.setItem("invitation", JSON.stringify(invitations[i]));
          }
        }
      }
    });

    // polls
    app
      .get("/polls/" + this.state.trip_id)
      .then((response) => {
        this.setState({ polls: this.createPolls(response.data.polls) });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTripOrganizer(user) {
    let profile;
    if (user.image === "./images/profile3.jpg") {
      profile = "profile3.jpg";
    } else {
      profile = user.image;
    }
    return (
      <Card style={{ margin: "0 auto", border: "transparent" }}>
        <Card.Body>
          <div>
            <img
              style={{ width: "50px" }}
              src={`http://trippinbucket.s3.amazonaws.com/${profile}`}

            />
          </div>
          <div>
            <strong>{user.first_name}</strong>
          </div>
        </Card.Body>
      </Card>
    );
  }

  getTripBuddies(buddyarray) {
    let buddycardarray = [];
    for (let i = 0; i < buddyarray.length; i++) {
      if (buddyarray[i].accepted == true) {
        let bpicture;
        if (buddyarray[i].buddy_picture == undefined) {
          bpicture = "placeholder.png";
        } else {
          bpicture = buddyarray[i].buddy_picture;
        }
        buddycardarray.push(
          <div key={i}>
            <Card style={{ margin: "0 auto", border: "transparent" }}>
              <Card.Body>
                <div>
                  <img style={{ width: "50px" }}

                    src={`http://trippinbucket.s3.amazonaws.com/${bpicture}`} />
                </div>
                <div>
                  <strong>{buddyarray[i].buddy_first_name}</strong>
                </div>
              </Card.Body>
            </Card>
          </div>
        );
      }
    }
    this.setState({ acceptedInvitations: buddycardarray });
    return buddycardarray;
  }

  createInvitation() {
    return (
      <Card
        style={{
          // paddingTop: "20px",
          margin: "0 auto 0 auto",
          width: "500px",
          border: "3px solid gray",
          borderRadius: "20px",
        }}
      >
        <Card.Header>YOU'VE BEEN INVITED TO THIS AWESOME TRIP!</Card.Header>
        <Card.Body>
          <div
            style={{
              margin: "0 auto",
              display: "flex",
              alignContent: "center",
            }}
          >
            <Button
              style={{ marginRight: "20px" }}
              onClick={this.acceptInvitation}
              variant="primary"
            >
              ACCEPT
            </Button>
            <Button
              style={{ marginLeft: "20px" }}
              onClick={this.declineInvitation}
              variant="secondary"
            >
              DECLINE
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  acceptInvitation = () => {
    let buddyyy = JSON.parse(localStorage.getItem("invitation"));
    let newtripbuddy = {
      owner_id: buddyyy.owner_id,
      trip_id: buddyyy.trip_id,
      buddy_id: buddyyy._id,
      accepted: true,
      denied: false,
      pending: false,
    };
    let newtrip = {};
    app
      .put("buddypending/" + buddyyy._id, newtripbuddy)
      .then((res) => {
        let buddies = this.state.trip.buddies;
        buddies.push(buddyyy.buddy_id);
        newtrip = {
          buddies: buddies,
        };

        return app.put("trip/" + buddyyy.trip_id, newtrip);
      })
      .then((r1) => {
        window.location = "/trip/" + this.state.trip_id;
      })
      .catch((err) => {
        console.log(err);
      });

    // let buddies = JSON.parse(localStorage.getItem("trip")).buddies;
  };

  declineInvitation() {
    let buddyyy = JSON.parse(localStorage.getItem("invitation"));
    let newtripbuddy = {
      owner_id: buddyyy.owner_id,
      trip_id: buddyyy.trip_id,
      buddy_id: buddyyy._id,
      accepted: false,
      denied: true,
      pending: false,
    };
    app
      .put("buddypending/" + buddyyy._id, newtripbuddy)
      .then((res) => { })
      .catch((err) => {
        console.log(err);
      });
    window.location = "/Home";
  }

  createPostCards(list) {
    let elements = [];
    for (let i = list.length - 1; i >= 0; i--) {
      this.setState({ secondaryComments: [] });
      let secondaryComments = [];
      if (list[i].commentsOnThisPost != "") {
        //secondaryComments = this.showCommentsOnPost(list[i].commentsOnThisPost);
        // console.log("*** " + secondaryComments.length);

        let commentlist = list[i].commentsOnThisPost;
        for (let j = 0; j < commentlist.length; j++) {
          let text = commentlist[j].text;
          if (commentlist[j].user_pic != null) {
            this.setState({
              commentuserimg:
                "./uploads/userProfileImage/" + commentlist[j].user_pic,
            });
          } else {
            this.setState({ commentuserimg: "./images/profilepic.png" });
          }
          this.setState({ text: text });
          this.setState({ userfirstname: commentlist[j].first_name });
          secondaryComments.push(
            <div key={j}>
              <ListGroup.Item>
                <img
                  alt="?"
                  style={{
                    width: "25px",
                    height: "25px",
                    border: "1px solid black",
                  }}
                  src={`http://trippinbucket.s3.amazonaws.com/${this.state.commentuserimg}`}

                />
                <strong> {this.state.userfirstname}: </strong> {this.state.text}
              </ListGroup.Item>
            </div>
          );
        }
        this.setState({ secondaryComments: secondaryComments });
      }

      let pa = "./uploads/userProfileImage/" + list[i].user_pic;

      elements.push(
        // <div key={i}>
        // {/* <div
        //   // className="post-card"
        //   className="containerBorder"
        //   style={{
        //     // margin: "0 10px 10px 10px",
        //     backgroundColor: "white",
        //     // borderRadius: "20px",
        //     // margin: "15px 0",
        //     // boxShadow: "8px 8px 50px #000",
        //     // width: "90%",
        //   }}
        // > */}
        // {/*<div
        //   className="img-responsive cover"
        //   style={{
        //     height: "100px",
        //     width: "400px",
        //     backgroundColor: "#6495ED"
        //   }}
        // ></div>*/}
        <Card
          key={i}
          style={{
            // borderRadius: "20px",
            marginTop: "20px",
            // backgroundColor: "transparent",
          }}
        >
          <Card.Header
            as="h5"
            style={{
              textTransform: "uppercase",
            }}
          >
            {" "}
            <img
              src={`http://trippinbucket.s3.amazonaws.com/${pa}`}

              style={{
                width: "40px",
                height: "40px",
                marginRight: "20px",
              }}
            />
            {list[i].first_name}
          </Card.Header>

          <Card.Body>
            <p>{list[i].text}</p>
            <ListGroup>
              <div>{this.state.secondaryComments}</div>
            </ListGroup>
          </Card.Body>
          <Card.Footer>
            <Form>
              <Form.Control
                id="secondary-comment"
                as="textarea"
                rows="1"
                placeholder="Comment on post..."
              ></Form.Control>
              <Button
                variant="outline-warning"
                onClick={(e) => this.commentOnPost(e, list[i])}
                style={{
                  float: "right",
                  marginTop: "10px",
                }}
              >
                POST
              </Button>
            </Form>
          </Card.Footer>
        </Card>
        //   {/* </div>
        // </div> */}
      );
    }

    return elements;
  }

  commentOnPost(e, i) {
    // let trip = JSON.parse(localStorage.getItem("trip"));
    let postArr = [];
    const commentOnThisPost = {
      owner_id: JSON.parse(localStorage.getItem("user"))._id,
      first_name: JSON.parse(localStorage.getItem("user")).first_name,
      last_name: JSON.parse(localStorage.getItem("user")).last_name,
      user_pic: JSON.parse(localStorage.getItem("user")).image,
      text: document.getElementById("secondary-comment").value,
      date: Date.now(),
    };
    if (i.commentsOnThisPost == null) {
      postArr.push(commentOnThisPost);
    } else {
      postArr = i.commentsOnThisPost;
      postArr.push(commentOnThisPost);
    }

    let comment = {
      commentsOnThisPost: postArr,
    };
    app
      .put("comment/" + i._id, comment)
      .then((res) => { })
      .catch((err) => {
        console.log(err);
      });
    window.location = "/trip/" + this.state.trip_id;
  }

  showRecommendations = () => {
    window.location = "/trip/" + this.state.trip_id + "/recommendations";
  };

  showSpendings = () => {
    window.location = "/trip/" + this.state.trip_id + "/spending";
  };

  getBuddyId() {
    //let self = this;
    app
      .get("useremail/" + document.getElementById("buddyemail").value)
      .then((response) => {
        let buddy = response.data.user;
        const buddyinfo = {
          owner_id: JSON.parse(localStorage.getItem("user"))._id,
          trip_id: this.state.trip_id,
          buddy_id: buddy._id,
          buddy_first_name: buddy.first_name,
          buddy_last_name: buddy.last_name,
          buddy_picture: buddy.image,
          accepted: false,
          denied: false,
          pending: true,
        };
        app
          .post("buddy", buddyinfo)
          .then((response) => {
            this.setState({ invitation_boolean: true });
            if (response.data.saved) {
              this.setState({
                invitation_sent: true,
                invitation_variant: "success",
                invitation_sent_msg: "Invitation was sent!",
              });
            } else {
              this.setState({
                invitation_variant: "warning",
                invitation_sent_msg: "Error occured",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addBuddy(buddyid) {
    const buddy = {
      owner_id: JSON.parse(localStorage.getItem("user"))._id,
      trip_id: this.state.trip_id,
      buddy_id: buddyid,
    };
    app
      .post("buddy", buddy)
      .then((response) => { })
      .catch((err) => {
        console.log(err);
      });
    //TODO: see if user and buddy are already friends
    // if they are, add friend to trip
    //send an invite to friend
  }

  postComment = (e) => {
    e.preventDefault();
    console.log("?????");
    // let trip = JSON.parse(localStorage.getItem("trip"));
    let trip = this.state.trip;
    let postArr = [];
    if (trip.posts == null) {
      trip.posts = [document.getElementById("comment").value];
    } else {
      postArr = trip.posts;
      postArr.push(document.getElementById("comment").value);
    }

    const comment = {
      owner_id: JSON.parse(localStorage.getItem("user"))._id,
      first_name: JSON.parse(localStorage.getItem("user")).first_name,
      last_name: JSON.parse(localStorage.getItem("user")).last_name,
      user_pic: JSON.parse(localStorage.getItem("user")).image,
      trip_id: this.state.trip_id,
      text: document.getElementById("comment").value,
      date: Date.now(),
    };
    console.log(comment);
    app
      .post("comment", comment)
      .then((res) => {
        this.setState({ addSurveyShow: true });
      })
      .catch((err) => {
        console.log(err);
      });
    window.location = "/trip/" + this.state.trip_id;
  };

  showDrivers = () => {
    // window.open("/trip/" + this.state.trip_id + "/drivers", "_blank");
    this.setState({ show_drivers: true });
    app
      .get("driver/friends/" + this.state.trip_id)
      .then((result) => {
        this.setState({ candidates: this.candidates(result.data.candidates) });
        return app.get("driver/" + this.state.trip_id);
      })
      .then((result) => {
        this.setState({ all_drivers: result.data.drivers });
        this.setState({ drivers: this.drivers(result.data.drivers) });
        this.setState({
          driver_passengers: this.passengers(result.data.drivers),
        });
      });
  };

  closeDrivers = () => {
    this.setState({ show_drivers: false });
  };

  updateModalContent() {
    app
      .get("driver/friends/" + this.state.trip_id)
      .then((result) => {
        this.setState({ candidates: this.candidates(result.data.candidates) });
        return app.get("driver/" + this.state.trip_id);
      })
      .then((result) => {
        this.setState({ all_drivers: result.data.drivers });
        this.setState({ drivers: this.drivers(result.data.drivers) });
        this.setState({
          driver_passengers: this.passengers(result.data.drivers),
        });
      });
  }

  candidates(list) {
    const elements = [];
    const httplist = [];
    let user = null;
    for (let i = 0; i < list.length; i++) {
      httplist.push(list[i].buddy_id);
    }
    app
      .post("user/getusersbylist", {
        list: httplist,
      })
      .then((r) => {
        this.setState({ all_candidates: r.data.users });
        for (let j = 0; j < r.data.users.length; j++) {
          user = r.data.users[j];
          if (user.image == null) {
            user.image = "./images/profilepic.png";
          }
          elements.push(
            <div
              style={{
                display: "flex",
                border: "1px solid black",
                borderRadius: "5px",
                margin: "5px",
                padding: "5px",
              }}
              key={j}
            >
              <img
                style={{ width: "50px" }}
                src={`http://trippinbucket.s3.amazonaws.com/${user.image}`}

                alt="userimage"
              />
              <div style={{ margin: "15px 5px 0 15px" }}>{user.first_name}</div>
              <div style={{ margin: "15px 0" }}>{user.last_name}</div>
              <div
                style={{
                  marginLeft: "5px",
                  marginTop: "15px",
                  float: "right",
                  cursor: "pointer",
                }}
              >
                {" "}
                <i className="fas fa-car" onClick={() => this.addDriver(j)}></i>
              </div>
              <div
                style={{
                  marginLeft: "5px",
                  marginTop: "15px",
                  float: "right",
                  cursor: "pointer",
                }}
              >
                <i
                  className="fas fa-plus-circle"
                  onClick={() => this.addPassenger(j)}
                ></i>
              </div>
            </div>
          );
        }
      });

    return elements;
  }
  drivers(list) {
    const elements = [];
    const httplist = [];
    let user = null;
    for (let i = 0; i < list.length; i++) {
      httplist.push(list[i].driver_id);
    }
    app
      .post("user/getusersbylist", {
        list: httplist,
      })
      .then((r) => {
        this.setState({ all_drivers: r.data.users });
        for (let j = 0; j < r.data.users.length; j++) {
          user = r.data.users[j];
          if (user == null) continue;
          if (user.image == null) {
            user.image = "./images/profilepic.png";
          }
          elements.push(
            <Nav.Item key={j} onClick={() => this.changeDriverNumber(j)}>
              <Nav.Link
                eventKey={j.toString()}
                style={{
                  display: "flex",
                  border: "1px solid black",
                  borderRadius: "5px",
                  margin: "5px",
                  padding: "5px",
                }}
              >
                <img
                  style={{ width: "50px" }}
                  src={`http://trippinbucket.s3.amazonaws.com/${user.image}`}

                  alt="userimage"
                />
                <div style={{ margin: "15px 5px 0 15px" }}>
                  {user.first_name}
                </div>
                <div style={{ margin: "15px 0" }}>{user.last_name}</div>
                <div
                  style={{
                    marginLeft: "5px",
                    marginTop: "15px",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className="fas fa-minus-circle"
                    onClick={() => this.removeDriver(j)}
                  ></i>
                </div>
              </Nav.Link>
            </Nav.Item>
          );
        }
      });
    return elements;
  }

  passengers(list) {
    const elements = [];
    for (let i = 0; i < list.length; i++) {
      const x = [];
      let user;
      for (let j = 0; j < list[i].passengers.length; j++) {
        if (list[i].passengers[j].passenger == undefined) continue;
        app.get("user/" + list[i].passengers[j].passenger).then((response) => {
          user = response.data.user;
          if (user.image == null) {
            user.image = "./images/profilepic.png";
          }
          x.push(
            <ListGroup.Item
              key={j}
              style={{
                display: "flex",
                border: "1px solid black",
                borderRadius: "5px",
                margin: "5px",
                padding: "5px",
              }}
            >
              <img
                style={{ width: "50px" }}
                src={`http://trippinbucket.s3.amazonaws.com/${user.image}`}
                alt="userimage"
              />
              <div style={{ margin: "15px 5px 0 15px" }}>{user.first_name}</div>
              <div style={{ margin: "15px 0" }}>{user.last_name}</div>

              <div
                style={{
                  marginLeft: "5px",
                  marginTop: "15px",
                  cursor: "pointer",
                }}
              >
                <i
                  className="fas fa-minus-circle"
                  onClick={() => this.removePassenger(list[i].passengers[j])}
                ></i>
              </div>
            </ListGroup.Item>
          );
        });
      }
      elements.push(
        <Tab.Pane key={i} eventKey={i}>
          <ListGroup>{x}</ListGroup>
        </Tab.Pane>
      );
    }
    return elements;
  }

  changeDriverNumber = (i) => {
    this.setState({ driver_number: i });
  };

  addDriver = (index) => {
    app
      .post("driver/", {
        trip_id: this.state.trip_id,
        driver_id: this.state.all_candidates[index]._id,
        first_name: this.state.all_candidates[index].first_name,
        last_name: this.state.all_candidates[index].last_name,
      })
      .then((result) => {
        this.updateModalContent();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  removeDriver = (index) => {
    app
      .post("driverremove/", {
        trip_id: this.state.trip_id,
        driver_id: this.state.all_drivers[index]._id,
      })
      .then((result) => {
        this.updateModalContent();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addPassenger(j) {
    app
      .post("driver/add", {
        trip_id: this.state.trip_id,
        driver_id: this.state.all_drivers[this.state.driver_number]._id,
        passenger: this.state.all_candidates[j]._id,
        first_name: this.state.all_candidates[j].first_name,
        last_name: this.state.all_candidates[j].last_name,
      })
      .then((result) => {
        this.updateModalContent();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  removePassenger(person) {
    app
      .post("driver/remove", {
        trip_id: this.state.trip_id,
        driver_id: this.state.all_drivers[this.state.driver_number]._id,
        passenger: person.passenger,
        first_name: person.first_name,
        last_name: person.last_name,
      })
      .then((result) => {
        this.updateModalContent();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  emailInfo = () => {
    app
      .get("/emailtripinfo/" + this.state.trip_id)
      .then((result) => {
        this.setState({ show_email_notification: true });
        if (result.data.sent == true) {
          this.setState({ email_success: true });
        } else {
          this.setState({ email_success: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  closeEmailInfo = () => {
    this.setState({ show_email_notification: false });
  };

  // create Polls
  addPull = () => {
    const options = [];
    if (this.state.option1.length != 0) {
      options.push({
        option: this.state.option1,
        votes: 0,
      });
    }
    if (this.state.option2.length != 0) {
      options.push({
        option: this.state.option2,
        votes: 0,
      });
    }
    if (this.state.option3.length != 0) {
      options.push({
        option: this.state.option3,
        votes: 0,
      });
    }
    if (this.state.option4.length != 0) {
      options.push({
        option: this.state.option4,
        votes: 0,
      });
    }
    if (this.state.option5.length != 0) {
      options.push({
        option: this.state.option5,
        votes: 0,
      });
    }
    app
      .post("/polls", {
        question: this.state.question,
        options: options,
        trip_id: this.state.trip_id,
      })
      .then((response) => {
        this.setState({ polls: this.createPolls(response.data.polls) });
        this.setState({ question: "" });
        this.setState({ option1: "" });
        this.setState({ option2: "" });
        this.setState({ option3: "" });
        this.setState({ option4: "" });
        this.setState({ option5: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // update poll options fields
  update = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  handleVote = (voteAnswer, id) => {
    app
      .post("/polls/update", {
        user_id: JSON.parse(localStorage.getItem("user"))._id,
        voteAnswer: voteAnswer,
        poll_id: id,
        trip_id: this.state.trip_id,
      })
      .then(async (response) => {
        // this.setState({ polls:
        //   this.createPolls(response.data.polls) });

        await new Promise((resolve) =>
          this.setState({ polls: this.createPolls(response.data.polls) }, () =>
            resolve()
          )
        );
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // create polls
  createPolls(polls) {
    let elements = [];
    let vote = "";
    for (let i = 0; i < polls.length; i++) {
      for (let j = 0; j < polls[i].voted.length; j++) {
        if (
          polls[i].voted[j].id == JSON.parse(localStorage.getItem("user"))._id
        ) {
          vote = polls[i].voted[j].answer;
        }
      }
      elements.push(
        <Poll
          key={i}
          question={polls[i].question}
          answers={polls[i].options}
          onVote={(answer) => this.handleVote(answer, polls[i]._id)}
          noStorage={true}
          vote={vote}
        />
      );
      vote = "";
    }
    return elements;
  }
  setDefaultImage(uploadType) {
    if (uploadType === "multer") {
      this.setState({
        trip_image: './uploads/tripProfileImage/' + "tripimage.jpg"
      });
    }
  }
  uploadImage(e, method) {
    let imageObj = {};
    if (method === "multer") {
      let imageFormObj = new FormData();
      //imageFormObj.append("imageName", "multer-image-" + Date.now());
      imageFormObj.append("imageCate", "trip");
      imageFormObj.append("imageData", e.target.files[0]);

      // stores a readable instance of 
      // the image being uploaded using multer

      this.setState({
        trip_image: URL.createObjectURL(e.target.files[0])
        //image: URL.createObjectURL(e.target.files[0])
      });
      // delete previous profile image
      //if (JSON.parse(localStorage.getItem('trip')).trip_image != null) {
      app.delete('trip/profile/' + JSON.parse(localStorage.getItem('trip'))._id).then(res => console.log(res.data))
        .catch(err => { console.log(err) });
      //}
      // then upload new profle image
      app.post('trip/image/' + JSON.parse(localStorage.getItem('trip'))._id, imageFormObj).then((data) => {
        if (data.data.success) {
          alert("Image has been successfully upload using multer");
          //this.setDefaultImage("multer");
        }
      }).catch((err) => {
        alert("Error while uploading image using multer");
        this.setDefaultImage("multer");
      });
    }
  }




  render() {
    let inviteBuddyClose = () => this.setState({ inviteBuddyShow: false });
    return (
      <div style={{ width: "100%", height: "100%", minHeight: "100%" }}>
        <div
          className="image-container"
          style={{
            // backgroundImage:
            //   "url(https://www.diabetes.co.uk/wp-content/uploads/2019/01/iStock-1001927840-1.jpg)",
            // backgroundImage: "url('images/bbb.jpg')",

            backgroundRepeat: "no-repeat",

            // backgroundImage:
            //   "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",

            // display: "flex",
          }}
        >
          <Toast
            show={this.state.show_email_notification}
            onClose={this.closeEmailInfo}
            autohide={true}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              marginTop: "60px",
              zIndex: "99",
            }}
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded mr-2"
                alt=""
              />
              <strong className="mr-auto">Email Trip Info</strong>
            </Toast.Header>
            <Toast.Body>
              {this.state.email_success == true
                ? "Trip info has been email to the atteendees!"
                : "Email failed to send"}
            </Toast.Body>
          </Toast>
          <div
            style={{
              // display: "flex",
              // flexDirection: "column",
              height: "100%",
              width: "100%",
              minHeight: "100%",
            }}
          >
            <div style={{ paddingTop: "25px" }}>{this.state.invitation}</div>
            {/* <div style={{ display: "flex", height: "100%", minHeight: "100%" }}> */}
            <div
              // className="container"
              style={{
                height: "100%",
                minHeight: "100%",
                width: "100%",
              }}
            >
              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "35%",
                  height: "100%",
                  minHeight: "100%",
                }}
              > */}
              <div
                className="row"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "100%",
                }}
              >
                <div className="col-md-1"></div>
                <div
                  className="col-md-3"
                  style={{
                    borderRadius: "5px",
                    height: "100%",
                    margin: "50px auto",
                    // border: "2px solid gray",
                    // boxSizing: "border-box",
                    // borderRadius: "20px",
                    // boxShadow: "8px 8px 50px #000",
                    // border: "1px solid rgba(34,36,38,.15)",
                    // boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
                    // color: "#6c757d",
                  }}
                >
                  <Card
                    className="containerBorder"
                    style={
                      {
                        // borderRadius: "20px",
                      }
                    }
                  >
                    <Card.Header as="h3" style={{ textTransform: "uppercase" }}>
                      {this.state.trip.trip_name}
                    </Card.Header>

                    <Card.Body>
                      <Card.Title>
                        <img
                          alt="trip"
                          style={{
                            width: "240px",
                            border: "2px solid gray",
                          }}
                          src={`http://trippinbucket.s3.amazonaws.com/${this.state.trip_image}`}

                        />
                      </Card.Title>
                      <Card.Title
                        style={{
                          textTransform: "uppercase",
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {this.state.trip.destination}
                      </Card.Title>
                      <Card.Title>
                        <i className="fas fa-plane-departure"></i>{" "}
                        {this.state.start}
                      </Card.Title>
                      <Card.Title>
                        <i className="fas fa-plane-arrival"></i>{" "}
                        {this.state.end}
                      </Card.Title>
                      <Card.Title style={{ marginTop: "10px" }}>
                        DRIVERS
                        <i
                          className="fas fa-info-circle"
                          style={{ marginLeft: "10px", cursor: "pointer" }}
                          onClick={this.showDrivers}
                        ></i>
                      </Card.Title>
                      <InviteDriver
                        show={this.state.show_drivers}
                        onHide={this.closeDrivers}
                        tripid={this.state.trip_id}
                      />
                      <Card.Title style={{ marginTop: "10px" }}>
                        TRIP ORGANIZER:
                      </Card.Title>
                      <div>{this.state.organizer}</div>

                      <Card.Title style={{ marginTop: "10px" }}>
                        TRAVEL BUDDIES:
                      </Card.Title>
                      <div>{this.state.acceptedInvitations}</div>
                      <Button
                        disabled={this.state.showInviteButton}
                        show="false"
                        onClick={() => this.setState({ inviteBuddyShow: true })}
                      >
                        INVITE
                      </Button>
                      <InviteBuddy
                        show={this.state.inviteBuddyShow}
                        onHide={inviteBuddyClose}
                        handler={this.handler}
                        trip_id={this.state.trip_id}
                        size="lg"
                      />
                    </Card.Body>
                  </Card>
                </div>

                <div
                  className="col-md-5"
                  style={{
                    width: "35%",
                    minHeight: "395px",
                    // height: "395px",
                    margin: "50px auto",
                    // borderRadius: "20px",
                    // color: "#6c757d",
                    // paddingRight: "20px",
                  }}
                >
                  <Card
                    className="containerBorder"
                    style={{
                      // boxShadow: "8px 8px 50px #000",
                      // borderRadius: "20px",
                      width: "100%",
                      // height: "100%",
                    }}
                  >
                    <Card.Header>MAKE A POST</Card.Header>
                    <Card.Body>
                      <Tabs
                        defaultActiveKey="comment"
                        id="uncontrolled-tab-example"
                      >
                        <Tab
                          eventKey="comment"
                          title="Comment"
                          style={{ marginTop: "20px", padding: "20px" }}
                        >
                          <form onSubmit={this.postComment}>
                            <input
                              required
                              id="comment"
                              type="textarea"
                              rows="2"
                              placeholder="Write post..."
                              className="form-control"
                              style={{
                                width: "100%",
                                // backgroundColor: "white",
                                border: "1px solid #CED4DA",
                                backgroundColor: "transparent",
                                color: "#6c757d",
                              }}
                            ></input>

                            <Button
                              type="submit"
                              variant="outline-warning"
                              style={{
                                float: "right",
                                marginTop: "10px",
                              }}
                            >
                              POST
                            </Button>
                          </form>
                        </Tab>
                        <Tab
                          eventKey="createpoll"
                          title="CreatePoll"
                          style={{ marginTop: "20px", padding: "20px" }}
                        >
                          <Form>
                            <Form.Group controlId="formBasicEmail">
                              <Form.Label>Question</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter question"
                                name="question"
                                value={this.state.question}
                                onChange={this.update}
                              />
                            </Form.Group>
                            <Form.Group key="1">
                              <Form.Label>Option 1</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter option"
                                value={this.state.option1}
                                name="option1"
                                onChange={this.update}
                              />
                            </Form.Group>
                            <Form.Group key="2">
                              <Form.Label>Option 2</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter option"
                                value={this.state.option2}
                                name="option2"
                                onChange={this.update}
                              />
                            </Form.Group>
                            <Form.Group key="3">
                              <Form.Label>Option 3</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter option"
                                value={this.state.option3}
                                name="option3"
                                onChange={this.update}
                              />
                            </Form.Group>
                            <Form.Group key="4">
                              <Form.Label>Option 4</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter option"
                                value={this.state.option4}
                                name="option4"
                                onChange={this.update}
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Option 5</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter option"
                                value={this.state.option5}
                                name="option5"
                                onChange={this.update}
                              />
                            </Form.Group>

                            <Button variant="primary" onClick={this.addPull}>
                              Submit
                            </Button>
                          </Form>
                        </Tab>
                        <Tab
                          eventKey="polls"
                          title="Polls"
                          style={{ marginTop: "20px", padding: "20px" }}
                          onClick={this.loadPolls}
                        >
                          {this.state.polls}
                        </Tab>
                      </Tabs>
                    </Card.Body>
                  </Card>
                  <div>{this.state.posts}</div>
                </div>

                <div
                  className="col-md-3"
                  style={{
                    // width: "30%",
                    // borderRadius: "5px",
                    margin: "50px auto",
                    // borderRadius: "20px",
                    color: "#6c757d",
                    // padding: "0 20px",
                  }}
                >
                  <Button
                    // variant="info"
                    style={{
                      display: "block",
                      background: "#4a7199",
                      border: "1px solid black",
                      width: "250px",
                      textShadow: "1.25px 1.25px black"
                      // boxShadow: "8px 8px 20px #000",
                    }}
                    onClick={this.showRecommendations}
                  >
                    Show Recommendations
                  </Button>

                  <Button
                    // variant="info"
                    style={{
                      display: "block",
                      background: "#4a7199",
                      border: "1px solid black",
                      width: "250px",
                      textShadow: "1.25px 1.25px black",
                      // boxShadow: "8px 8px 20px #000",
                      marginTop: "10px",
                    }}
                    onClick={this.showSpendings}
                  >
                    Show Spendings
                  </Button>

                  <Button
                    // variant="info"
                    style={{
                      display: "block",
                      background: "#4a7199",
                      border: "1px solid black",
                      width: "250px",
                      textShadow: "1.25px 1.25px black",
                      // boxShadow: "8px 8px 20px #000",
                      marginTop: "10px",
                    }}
                    onClick={this.emailInfo}
                  >
                    Email Trip Info
                  </Button>
                  <Button
                    // variant="info"
                    style={{
                      display: "block",
                      background: "#4a7199",
                      border: "1px solid black",
                      width: "250px",
                      textShadow: "1.25px 1.25px black",
                      // boxShadow: "8px 8px 20px #000",
                      marginTop: "10px",
                    }}
                    onClick={(e) => this.setState({ showMulterPanel: !(this.state.showMulterPanel) })}
                  >
                    Edit Trip Cover Photo
                  </Button>
                  <Collapse isOpen={this.state.showMulterPanel}>
                    <Card style={{ width: "250px" }}>
                      <Card.Body>
                        <div className="image-container1" >
                          <div className="process">
                            {/* <h4 className="process_heading">Trip Image: </h4>
                      <p className="process_details">Upload image from your local device</p> */}
                            <input type="file" className="process_upload-btn" onChange={(e) => this.uploadImage(e, "multer")} />
                            src={`http://trippinbucket.s3.amazonaws.com/${this.state.trip_image}`}
                             alt="upload-image" className="process_image" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

                  </Collapse>

                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default CurrentTrip;
