import React, { Component } from "react";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: ''
    }
  }

  componentDidMount() {
    if (JSON.parse(localStorage.getItem('user'))) {
      this.setState({ page: '/home' });
    }
    else {
      this.setState({ page: '/login' });
    }
  }
  render() {
    return (
      <header>
        <div className="head" >

          <h1 style={{ textShadow: "1px 1px white" }}>
            We Design,
            <br /> You Travel
          </h1>
          <div>
            <p style={{ textShadow: "1px 1px white", fontWeight: "bold" }}>
              We help you plan and schedule your perfect trip. So you can spend
              and enjoy your vacation time with friends and family
            </p>
            <div>
              <a className="contact" href={this.state.page} style={{
                color: "white",
                textShadow: "1px 1px black",
                backgroundColor: "#4a7199",
                border: "2px solid black"
              }}>
                LET'S GET STARTED!
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
