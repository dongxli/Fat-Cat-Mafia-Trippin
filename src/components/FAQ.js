import React, { Component } from 'react';
import Footer from "./TrippinPage/footer";
import { Accordion, Card, Button } from 'react-bootstrap';


class FAQ extends Component {
    render() {
        return (
            <div style={{ backgroundColor: "rgb(218,230,242)" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h5 style={{ textAlign: "center", paddingTop: "30px", paddingBottom: "20px" }}>NEW TO TRIPPIN? FOLLOW THIS GUIDE TO GET YOU STARTED:</h5>
                        <div>
                            <Accordion defaultActiveKey="0">
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            Create An Account
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            Check the top right of the page for the link to Register
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                            Find Your Friends
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <ul>
                                                <li>Once logged in to your account, you'll see a menu button</li>
                                                <li>Otherwise look for the link on your home page (Under your profile picture)</li>
                                                <li>Select the 'Friends' option</li>
                                                <li>Enter the email of your friends that are part of Trippin</li>

                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                            Create A Trip
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>
                                            <ul>
                                                <li>Find the link in the top menu button or on your home page</li>
                                                <li>Enter your Trip info and fill out the survey</li>
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                            Check out your Trip details and start planning!
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body>
                                            Your trip will now be shown on your home page, go ahead and open it
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                            Plan your trip with all your travellers
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="4">
                                        <Card.Body>
                                            <ul>
                                                <li>If you're traveling with others, you can invite them to be a part of the planning</li>
                                                <li>Select the 'INVITE' button on the left side of your Trip page</li>
                                                <li>If they are already your Trippin friend, you'll see them on the screen</li>
                                                <li>Otherwise, send them an email by entering their email address</li>
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                            Now that your buddies have joined, communicate with them
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="5">
                                        <Card.Body>
                                            <ul>
                                                <li>Post comments on the page for all your travellers to see</li>
                                                <li>Post polls to get your travellers' opinions</li>
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                            Now let's really get planning!
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="6">
                                        <Card.Body>
                                            <ul>
                                                <li>Select the 'Show Recommendations' button on the right</li>
                                                <li>Scroll through the recommendations</li>
                                                <li>Choose the ones you're interested in by clicking the green add button</li>
                                                <li>Check out more information about the recommendation by clicking on the name </li>
                                                <li>You'll have the option to filter through your selections later</li>
                                                <li>Once done selecting, click the link to 'Arrange Trip Schedule'</li>
                                                <ul><li>You can come back here at any time to add more, don't worry</li></ul>
                                                <li>Drag and drop your selections on to your schedule</li>
                                                <li>Save your schedule after making any changes (button on top right)</li>
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                            <div style={{ margin: "30px auto", width: "70%", minWidth: "70%" }}>
                                <h5>FREQUENTLY ASKED QUESTIONS:</h5>
                                <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                Can I connect with my friends on Trippin?
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                Trippin allows you to find your friends (from the top menu) by sending and
                                                accepting friend requests. From there, planning trips with your friends is easy!
                                        </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                Can I create an itinerary for travelling outside of the U.S.?
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body>
                                                Of course! Trippin works for global travel.
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                How does Trippin make travel planning easier?
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="2">
                                            <Card.Body>
                                                Trippin allows you to find all the restaurants, attractions and events that interest you
                                                all from one place. Also, Trippin makes it easy to plan trips with others by allowing each
                                                traveller to be a part of the planning. Post your comments and create polls to get everyone's
                                                input.
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                                Can I share my itinerary with others that are not on Trippin?
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="3">
                                            <Card.Body>
                                                Trippin allows you to create a pdf of your itinerary that will be emailed to you and is yours to share!
                                        </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>



                                </Accordion>
                            </div>


                        </div>

                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default FAQ;