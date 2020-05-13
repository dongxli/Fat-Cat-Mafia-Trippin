import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { NavLink as RRNavLink } from "react-router-dom";
import {
  NavLink,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import { Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Email from "./ValidateEmail";
import Home from "./Home";
import MyAccount from "./MyAccount";
import Trip from "./Trip";
import Friends from "./Friends";
import TRIPPIN from "./Trippin";
import CurrentTrip from "./CurrentTrip";
import Spending from "./Spending";
import { DropdownButton } from "react-bootstrap";
import Recommendation from "./Recommendation";
import ForgotPassword from "./ForgotPassword";
import FAQ from "./FAQ";
import Survey from "./Survey";

import ResetPassword from "./ResetPassword";
//import UpdatePasswordViaEmail from "./UpdatePasswordViaEmail";
import Schedule from "./Schedule";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
} from "reactstrap";

class AppNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      user: null,
    };
  }

  componentDidMount() {
    this.setState({ user: JSON.parse(localStorage.getItem("user")) });
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("trip");
    localStorage.removeItem("invitation");
    localStorage.removeItem("survey");
    document.location.href = "/";
  };

  render() {
    const LOGGED_IN = (
      <Fragment>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret style={{ color: "white" }}></DropdownToggle>
          <DropdownMenu right>
            <DropdownItem href="/Home">HOME</DropdownItem>
            <DropdownItem href="/MyAccount">EDIT</DropdownItem>
            <DropdownItem href="/Friends">FRIENDS</DropdownItem>
            <DropdownItem href="/Trip">CREATE A TRIP</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={this.logout}>LOG OUT</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

        {/*         <NavItem style={{ cursor: "pointer" }}>
          <NavLink>Logged in!</NavLink>
        </NavItem> */}
      </Fragment>
    );

    const LOGGED_OUT = (
      <Fragment>
        <NavItem>
          <NavLink tag={RRNavLink} exact to="/Login">
            Log In
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} exact to="/Register">
            Register
          </NavLink>
        </NavItem>
      </Fragment>
    );
    return (
      <div style={{ height: "100%" }}>
        <Router>
          {/* <Navbar sticky="top" color="dark" dark expand="sm"> */}
          <Navbar
            sticky="top"
            expand="sm"
            style={{
              background: "#242529",
              boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.04)",
              padding: "0",
              height: "8%"
            }}
          >
            <Container style={{ background: "#242529", }}>
              <NavbarBrand href="/">
                <img
                  src={require("./images/trippinicon.jpg")}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{" "}
              </NavbarBrand>
              <span
                style={{
                  color: "#fff",
                  fontFamily: "helvetica, arial",
                  fontWeight: "bold",
                  fontSize: "20px",
                  letterSpacing: "3px",
                  textShadow: "1.25px 1.25px #4a7199"
                }}
              >
                TRIPPIN
              </span>
              <NavbarToggler onClick={this.toggle} />
              <Collapse
                // className="bg-dark"
                isOpen={this.state.isOpen}
                navbar
                style={{ background: "#242529" }}
              >
                <Nav className="ml-auto" navbar>
                  {this.state.user ? LOGGED_IN : LOGGED_OUT}
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
          <Switch>
            <Route path="/trip/:id/schedule" exact component={Schedule}></Route>
            <Route
              path="/trip/:id/recommendations"
              exact
              component={Recommendation}
            ></Route>
            <Route path="/trip/:id/spending" exact component={Spending}></Route>
            <Route path="/trip/:id" exact component={CurrentTrip}></Route>
            <Route path="/trip">
              <Trip />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/myAccount">
              <MyAccount />
            </Route>
            <Route path="/survey">
              <Survey />
            </Route>
            <Route path="/FAQ">
              <FAQ />
            </Route>
            <Route path="/email">
              <Email />
            </Route>
            <Route path="/friends">
              <Friends />
            </Route>
            <Route path="/forgotPassword">
              <ForgotPassword />
            </Route>
            {/* <Route path="/resetPassword/:token">
              <ResetPassword />
            </Route> */}
            <Route
              exact
              path="/resetPassword/:token"
              component={ResetPassword}
            />
            <Route path="/updatePasswordViaEmail"></Route>
            <Route path="/tripbuddy"></Route>
            <Route path="/home">
              <Home />
            </Route>

            <Route path="/">
              <TRIPPIN />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default AppNavBar;
