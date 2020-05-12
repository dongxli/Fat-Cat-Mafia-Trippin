import React, { Component } from "react";
import {
  Modal,
  ListGroup,
  Container,
  Row,
  Col,
  Tab,
  Nav,
} from "react-bootstrap";
import { app } from "../utils/AxiosConfig";
//const AXIOS = require("axios").default;

export class InviteDriver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trip_id: this.props.tripid,
      all_candidates: [],
      candidates: [],
      all_drivers: [],
      drivers: [],
      all_driver_passengers: [],
      driver_passengers: [],
      driver_number: "0",
    };
  }

  // get all drivers with its passengers and candidates
  componentDidMount() {
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
        window.location.reload();
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
          let image = "";
          if (user == null) continue;
          if (user.image == null) {
            image = "./images/profilepic.png";
          } else {
            image = "./uploads/userProfileImage/" + user.image;
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
                  src={require(`${image}`)}
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
                src={require(`${user.image}`)}
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

  render() {
    return (
      <Modal {...this.props} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Drivers</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row className="show-grid">
              <Col md={8}>
                <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey={this.state.driver_number}
                >
                  <Row>
                    <Col md={5}>
                      <h5>Drivers</h5>
                      <Nav variant="pills" className="flex-column">
                        {this.state.drivers.length != 0
                          ? this.state.drivers
                          : ""}
                      </Nav>
                    </Col>
                    <Col md={5}>
                      <h5>Passengers</h5>
                      <Tab.Content>
                        {this.state.driver_passengers.length != 0
                          ? this.state.driver_passengers
                          : ""}
                      </Tab.Content>
                    </Col>
                    <Col md={2}></Col>
                  </Row>
                </Tab.Container>
              </Col>
              <Col md={4} style={{ borderLeft: "1px solid black" }}>
                <ListGroup>
                  <h5>Candidates</h5>
                  {this.state.candidates.length != 0
                    ? this.state.candidates
                    : ""}
                </ListGroup>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
}

export default InviteDriver;
