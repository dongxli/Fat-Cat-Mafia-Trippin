import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <main>
        <section className="intro">
          <h2>About Us</h2>
          <div>
            <p>
              Trippin is a website designed to make traveling eaiser to manage.
              A senior project made to help us learn more about the softwares
              and cs principals to help us prepare for the future.
            </p>
          </div>
        </section>

        <div>
          <div className="services" style={{}}>
            <div className="service-one">
              <p className="service-icon" >
                <i className="far fa-calendar-alt" style={{ color: "rgb(53,128,134)" }}></i>
              </p>
              <p className="service-title" style={{ color: "#DC143C	" }}>
                Planning
              </p>
              <p style={{ color: "white" }}>
                Save your time by planning where to go and share expenses with
                your buddies!
              </p>
            </div>
            <div className="service-two">
              <p className="service-icon">
                <i className="fas fa-crop" style={{ color: "rgb(53,128,134)" }}></i>
              </p>
              <p className="service-title" style={{ color: "#DC143C	" }}>
                Scheduling
              </p>
              <p style={{ color: "white" }}>
                Schedule your days during the trip location by location!
              </p>
            </div>
            <div className="service-three">
              <p className="service-icon">
                <i className="fas fa-code" style={{ color: "rgb(53,128,134)" }}></i>
              </p>
              <p className="service-title" style={{ color: "#DC143C	" }}>
                Collaborating
              </p>
              <p style={{ color: "white" }}>
                Collaborate with your friends and family members to create the
                ultimate vacation!
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2>Our Mission</h2>
          <div>
            <p>
              We try to help users to create the best vacation they can have by
              providing them with planning, scheduling, and collaborating
              features. We believe the users should have easier time when
              planning and concluding their trip, so we have features such as
              mileage calculation to help you shcedule your days and share your
              expenses with your buddies.
            </p>
          </div>
        </section>
      </main>
    );
  }
}

export default Main;
