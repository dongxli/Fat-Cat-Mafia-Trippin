import React from 'react';
import PropTypes from 'prop-types';
import "../styles/SurveyQuiz.css";


function AnswerOption(props) {

  /*  function renderAnswerOptions(key) {
        return (
          <AnswerOption
            key={key.content}
            answerContent={key.content}
            //answerType={key.type}
            answer={props.answer}
            questionId={props.questionId}
            onAnswerSelected={props.onAnswerSelected}
          />
        );
      }
      */

  return (
    <li className="answerOption">
      <input
        type="radio"
        className="radioCustomButton"
        name="radioGroup"
        checked={props.answerContent === props.answer}
        //checked={props.answerType === props.answer}
        id={props.answerContent}
        //id={props.answerType}
        value={props.answerContent}
        //value={props.answerType}
        disabled={props.answer}
        onChange={props.onAnswerSelected}
      />
      <label className="radioCustomLabel" htmlFor={props.answerContent}>
        {props.answerContent}
      </label>
    </li>
  );
}

AnswerOption.propTypes = {
  //answerType: PropTypes.string.isRequired,
  answerContent: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  onAnswerSelected: PropTypes.func.isRequired
};

export default AnswerOption;