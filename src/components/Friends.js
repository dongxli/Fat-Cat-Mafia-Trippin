import React, { Component } from "react";
import { Button, Alert, Form } from "react-bootstrap";
import { app } from "../utils/AxiosConfig";
import Footer from "./TrippinPage/footer";
//import AXIOS from "axios";

import "../styles/Friends.css";

class Friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friend: null,
      friend_list: [],
      has_friends: false,
      incoming_pending_friends: [],
      has_friend_requests: false,
      search_email: "",
      search_message: "",
      search_boolean: false,
      search_alert_variant: "",
      user_profile_image: "placeholder.png",
    };
  }

  componentDidMount() {
    app.get('user/' + JSON.parse(localStorage.getItem('user'))._id)
      .then(response => {
        console.log(response.data.user.email);
        if (response.data.user.image != null) {
          this.setState({ user_profile_image: response.data.user.image });
        }
      }).catch(function (error) {
        console.log(error);
      });

    app
      .get("friend/" + JSON.parse(localStorage.getItem("user"))._id)
      .then((res) => {
        this.setState({ friend: res.data.friend });
        if (res.data.confirmed_friends.length > 0) {
          this.setState({ has_friends: true });
        }
        if (res.data.pending_friend_requests.length > 0) {
          this.setState({ has_friend_requests: true });
        }
        this.setState({
          friend_list: this.createList(res.data.confirmed_friends),
        });

        this.setState({
          incoming_pending_friends: this.createPendingList(
            res.data.pending_friend_requests
            // res.data.confirmed_friends
          ),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  emailOnChange = (e) => {
    this.setState({ search_email: e.target.value });
    this.setState({ search_boolean: false });
  };

  onSearchFieldClick = () => {
    const USER = JSON.parse(localStorage.getItem("user"));
    app
      .post("friend/add", {
        user_id: USER._id,
        user_email: USER.email,
        adding_friend: this.state.search_email,
      })
      .then((response) => {
        this.setState({ search_boolean: true });
        this.setState({ search_message: response.data.respond_message });
        if (response.data.added) {
          this.setState({ search_alert_variant: "success" });
        } else {
          this.setState({ search_alert_variant: "warning" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  acceptFriend = (e) => {
    let index = e.target.id.replace("incoming_friends", "");
    app
      .post("friend/accept", {
        user_id: this.state.friend.owner_id,
        adding_friend: this.state.friend.incoming_pending_friends[index],
      })
      .then((response) => {
        this.setState({
          friend_list: this.createList(response.data.confirmed_friends),
        });
        this.setState({
          incoming_pending_friends: this.createPendingList(
            response.data.pending_friend_requests
          ),
        });
      });
  };

  createList(list) {
    let elements = [];
    for (let i = 0; i < list.length; i++) {
      elements.push(
        <div className="col-md-3 col-sm-6" key={i}>
          <div className="friend-card">
            <div
              className="img-responsive cover"
              style={{
                height: "100px",
                width: "400px",
                backgroundColor: "#6495ED",
              }}
            ></div>
            <div className="card-info">
              {list[i].image ? (
                <img
                  src={`http://fatcatimages.s3.amazonaws.com/${list[i].image}`}

                  alt="user"
                  className="profile-photo-lg"
                />
              ) : (
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    alt="user"
                    className="profile-photo-lg"
                  />
                )}

              <div className="friend-info">
                <span className="pull-right text-green">My Friend</span>
                <h5>
                  <p className="profile-fonts">
                    {list[i].first_name} {list[i].last_name}
                  </p>
                </h5>
                <p className="profile-email-fonts">{list[i].email}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (list.length < 4) {
      for (let i = 0; i < 4 - list.length - 1; i++) {
        elements.push(
          <div
            className="col-md-3 col-sm-6"
            style={{ minWidth: "400px" }}
            key={4 - i}
          ></div>
        );
      }
    }
    return elements;
  }

  createPendingList(list) {
    let elements = [];
    for (let i = 0; i < list.length; i++) {
      elements.push(
        <div className="col-md-3 col-sm-6" key={i}>
          <div className="friend-card">
            <div
              className="img-responsive cover"
              style={{
                height: "100px",
                width: "400px",
                backgroundColor: "#cd5c5c",
              }}
            ></div>
            <div className="card-info">
              {list[i].image ? (
                <img
                  src={`http://fatcatimages.s3.amazonaws.com/${list[i].image}`}

                  alt="user"
                  className="profile-photo-lg"
                />
              ) : (
                  <img
                    //src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    src={`http://fatcatimages.s3.amazonaws.com/${list[i].image}`}

                    alt="user"
                    className="profile-photo-lg"
                  />
                )}

              <div className="friend-info">
                <span
                  className="pull-right text-green"
                  onClick={this.acceptFriend}
                  id={"incoming_friends" + i}
                  style={{ cursor: "pointer", color: "#cd5c5c" }}
                >
                  Accept Friend Request
                </span>
                <h5>
                  <p className="profile-fonts">
                    {list[i].first_name} {list[i].last_name}
                  </p>
                </h5>
                <p className="profile-email-fonts">{list[i].email}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (list.length < 4) {
      for (let i = 0; i < 4 - list.length - 1; i++) {
        elements.push(
          <div
            className="col-md-3 col-sm-6"
            style={{ minWidth: "400px" }}
            key={4 - i}
          ></div>
        );
      }
    }
    return elements;
  }

  render() {
    //let user = JSON.parse(localStorage.getItem("user"));
    return (
      <div >
        <div className="container">
          <div className="create-post">
            <div className="row">
              <div className="col-md-8">
                <Form
                  style={{
                    display: "table",
                    tableLayout: "fixed",
                  }}
                >
                  {/* {user.image ? (
                    <img
                      //src={require('./uploads/userProfileImage/'+`${user.image}`)}
                      alt=""
                      className="profile-photo-md"
                    />
                  ) : (
                    <img
                      //src="https://bootdey.com/img/Content/avatar/avatar1.png"
                      src={require('./uploads/userProfileImage/'+`${user.image}`)}
                      alt=""
                      className="profile-photo-md"
                    />
                  )} */}
                  {<img
                    src={`http://fatcatimages.s3.amazonaws.com/${this.state.user_profile_image}`}

                    alt=""
                    className="profile-photo-md"
                  />}
                  <Form.Group
                    style={{
                      display: "table-cell",
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                  >
                    <Form.Control
                      className="ml-2"
                      type="email"
                      placeholder="name@example.com"
                      onChange={this.emailOnChange}
                    />
                  </Form.Group>
                  <Button
                    className="ml-3"
                    // variant="info"
                    style={{ background: "#4a7199" }}
                    onClick={this.onSearchFieldClick}
                  >
                    Add
                  </Button>
                </Form>
                {this.state.search_boolean ? (
                  <Alert
                    variant={this.state.search_alert_variant}
                    style={{ marginBottom: "0", marginTop: "6px" }}
                  >
                    {this.state.search_message}
                  </Alert>
                ) : (
                    ""
                  )}
              </div>
            </div>
          </div>
          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-3" style={{ margin: "0 auto 20px 0" }}>
              {this.state.has_friend_requests ? (
                <span
                  style={{
                    fontFamily: "Lemonada, cursive",
                    fontSize: "14px",
                    fontWeight: "normal",
                  }}
                >
                  Pending Friend Requests
                </span>
              ) : (
                  <span></span>
                )}
            </div>
            <div className="col-md-9"></div>
          </div>
          {/* pending friends */}
          <div className="friend-list">
            <div className="row">{this.state.incoming_pending_friends}</div>
          </div>

          <div className="row" style={{ width: "100%" }}>
            <div className="col-md-3" style={{ margin: "0 auto 20px 0" }}>
              {this.state.has_friends ? (
                <span
                  style={{
                    fontFamily: "Lemonada, cursive",
                    fontSize: "14px",
                  }}
                >
                  My Friends
                </span>
              ) : (
                  <span></span>
                )}
            </div>
            <div className="col-md-9"></div>
          </div>
          {/* friends */}
          <div className="friend-list">
            <div className="row">{this.state.friend_list}</div>
          </div>
        </div>
        <div style={{ height: "65px" }}></div>
        <Footer />
      </div>
    );
  }
}

export default Friends;
