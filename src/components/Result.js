import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import "../styles/SurveyQuiz.css";



function Result(props) {
    return (
        <div
          className="container result"
          component="div"
          transitionName="fade"
          transitionEnterTimeout={800}
          transitionLeaveTimeout={500}
          transitionAppear
          transitionAppearTimeout={500}
        >
          <div>
            You Answers Are <strong>Saved!</strong>!
          </div>
        </div>
      );
}

Result.propTypes = {
  quizResult: PropTypes.string.isRequired,
};

export default Result;