/*
import React, { Component } from 'react';
//import PropTypes from 'prop-types';

class Question extends Component {

  handleSubmit(event) {
    this.setState({ answer: event.target.value });
  }

  handleChange(e) {
    this.setState({});
  }
  render() {
    return (
      <div className="question">
        <p>{this.props.survey.questionId}</p>
        <p>{this.props.survey.question}</p>
        <input text="text" answer="answer" onChange={this.handleChange} />
      </div>
    )
  }
}
/*
function Question(props) {
  return (
    <h2 className="question">{props.content}</h2>
  );
}

Question.propTypes = {
  content: PropTypes.string.isRequired
};
*/

import React from 'react';
import PropTypes from 'prop-types';
import "../styles/SurveyQuiz.css";


function Question(props) {
  return (
    <h2 className="question">{props.content}</h2>
  );
}

Question.propTypes = {
  content: PropTypes.string.isRequired
};

export default Question;