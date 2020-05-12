import React, { Component } from "react";
import { Modal, Button, FormControl, Alert, InputGroup } from "react-bootstrap";
import "../styles/InviteBuddy.css";
import { app } from "../utils/AxiosConfig";
//const AXIOS = require("axios").default;

export class InviteBuddy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitation_sent: false,
      invitation_boolean: false,
      invitation_sent_msg: "",
      invitation_sent_variant: "",
      currentFriend: {},
      selectedFriends: [],
      email_boolean: false,
      email_sent_msg: "",
      email_sent_variant: "",
      checked: false,
      trip_id: this.props.trip_id,
      trip: {},
    };

    this.handleChange = this.handleChange.bind(this);
    //  this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    app
      .get("friend/" + JSON.parse(localStorage.getItem("user"))._id)
      .then((result) => {
        this.setState({
          friends: this.showFriends(result.data.friend.confirmed_friends),
        });
        return app.get("/tripinfo/" + this.state.trip_id);
      })
      .then((r) => {
        this.setState({ trip: r.data.trip });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showFriends(list) {
    let friendslist = [];
    let user = null;
    for (let i = 0; i < list.length; i++) {
      app.get("user/" + list[i]).then((response) => {
        user = response.data.user;
        if (user.image == null) {
          user.image = "./images/profilepic.png";
        }
        friendslist.push(
          <label key={i} label="Check me out">
            <input
              type="checkbox"
              value={user._id}
              onClick={this.handleChange}
            />
            <div
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
            </div>
          </label>
        );
      });
      // this.setState({ currentFriend: user });
    }
    return friendslist;
  }

  //once a buddy 'button' is selected, the buddy id is added to a list stored as a state
  handleChange(event) {
    let selected = [];
    if (this.state.selectedFriends != null) {
      selected = this.state.selectedFriends;
    }
    if (selected.includes(event.target.value) === false) {
      selected.push(event.target.value);
      this.setState({ selectedFriends: selected });
      console.log(this.state.selectedFriends);
    } else if (selected.includes(event.target.value) === true) {
      let index = selected.indexOf(event.target.value);
      console.log(index);
      selected = selected.splice(index, 1);
      this.setState({ selectedFriends: selected });
      console.log(this.state.selectedFriends);
    }
    // console.log(selected);
  }

  /* handleSubmit(event) {
          event.preventDefault();
          console.log(this.state.selectedFriends);
          for (let i = 0; i < this.state.selectedFriends; i++) {
              console.log(this.state.selectedFriends[i])
              this.inviteBuddy(this.state.selectedFriends[i])
          }
      } */

  inviteBuddy() {
    //get the selected buddies
    console.log(this.state.selectedFriends);
    let buddies = this.state.selectedFriends;
    if (buddies != null) {
      //for each buddy selected, send an AXIOS get call to get their user data
      for (let i = 0; i < buddies.length; i++) {
        app.get("user/" + buddies[i]).then((resp) => {
          let buddy = resp.data.user;
          //create a tripbuddy object
          const buddyinfo = {
            owner_id: JSON.parse(localStorage.getItem("user"))._id,
            trip_id: this.state.trip_id,
            trip_name: this.state.trip.trip_name,
            buddy_id: buddy._id,
            buddy_first_name: buddy.first_name,
            buddy_last_name: buddy.last_name,
            buddy_picture: buddy.image,
            owner_first_name: JSON.parse(localStorage.getItem("user"))
              .first_name,
            owner_last_name: JSON.parse(localStorage.getItem("user")).last_name,
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
        });
      }
    }
  }

  /* getBuddyId() {
    //let self = this;
    console.log(document.getElementById("buddyemail").value);
    AXIOS.get(
      "http://localhost:4000/useremail/" +
        document.getElementById("buddyemail").value
    )
      .then((response) => {
        let buddy = response.data.user;
        console.log(response);
        const buddyinfo = {
          owner_id: JSON.parse(localStorage.getItem("user"))._id,
          trip_id: JSON.parse(localStorage.getItem("trip"))._id,
          buddy_id: buddy._id,
          buddy_first_name: buddy.first_name,
          buddy_last_name: buddy.last_name,
          buddy_picture: buddy.image,
          accepted: false,
          denied: false,
          pending: true,
        };
        AXIOS.post("http://localhost:4000/buddy", buddyinfo)
          .then((response) => {
            console.log(response);
            this.setState({ invitation_boolean: true });
            console.log(this.state.invitation_boolean);
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
  } */

  sendEmail() {
    console.log(document.getElementById("email").value);
    let newUser = {
      email: document.getElementById("email").value,
    };
    app
      .put("buddyinvite", newUser)
      .then((response) => {
        console.log(response);
        this.setState({ email_boolean: true });
        if (response.status == 200) {
          this.setState({
            email_sent: true,
            email_variant: "success",
            email_sent_msg: "An Email has been sent!",
          });
        } else {
          this.setState({
            email_variant: "warning",
            email_sent_msg: "Error occured",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>INVITE</Modal.Header>
        <Modal.Body>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div>{this.state.friends}</div>

            <Button
              variant="outline-success"
              onClick={this.inviteBuddy.bind(this)}
            >
              SEND
            </Button>
          </form>
          <div>
            {this.state.invitation_boolean ? (
              <Alert
                variant={this.state.invitation_sent_variant}
                style={{ marginBottom: "0", marginTop: "6px" }}
              >
                {this.state.invitation_sent_msg}
              </Alert>
            ) : (
                ""
              )}
          </div>
          <label
            style={{
              width: "100%",
              marginTop: "50px auto",
              display: "block",
            }}
            htmlFor="basic-url"
          >
            Invite A Buddy Outside Of Your Friends List:
          </label>
          <InputGroup
            style={{ width: "400px", display: "flex", margin: "0 auto" }}
          >
            <FormControl
              placeholder="Recipient's email"
              aria-label="Recipient's email"
              aria-describedby="basic-addon2"
              id="email"
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={this.sendEmail}>
                Send Email
              </Button>
            </InputGroup.Append>
          </InputGroup>
          {this.state.email_boolean ? (
            <Alert
              variant={this.state.email_sent_variant}
              style={{ marginBottom: "0", marginTop: "6px" }}
            >
              {this.state.email_sent_msg}
            </Alert>
          ) : (
              ""
            )}
        </Modal.Body>
        {/* <Modal.Footer>
                    <Button onClick={this.getBuddyId} >SEND</Button>
                    <Button onClick={this.props.onHide} >CLOSE</Button>
                </Modal.Footer> */}
      </Modal>
    );
  }
}

export default InviteBuddy;
