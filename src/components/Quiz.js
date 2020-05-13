/*
import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { QuestionData } from './QuestionData';
import { app } from '../utils/AxiosConfig';

//const AXIOS = require("axios").default;
export class Quiz extends Component {


  //import Question from './components/Question';

  constructor(props) {
    super(props);
    this.state = {
      userAnswer: null,
      currentQuestion: 0,
      options: [],
      quizEnd: false
    };
  };

  handleChange(e) {
    let id = e.target.currentQuestion;
    let input = e.target.value;
    this.setState({ userAnswer: input });
    this.saveAnswer(e);
    console.log(id);
    console.log(input);
  }


  saveAnswer() {
    // e.preventDefault();
    const { currentQuestion } = this.state;
    const surveyQuestion = {
      questions: QuestionData[currentQuestion].question,
      options: QuestionData[currentQuestion].options,
      answers: QuestionData[currentQuestion].answer
    }

    console.log(JSON.stringify(surveyQuestion));
    app.put('question', surveyQuestion)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })


  }

  loadSurvey = () => {
    const { currentQuestion } = this.state;
    this.setState(() => {
      return {
        questions: QuestionData[currentQuestion].question,
        options: QuestionData[currentQuestion].options,
        answers: QuestionData[currentQuestion].answer
      }
    })
    this.saveAnswer();
  }

  componentDidMount() {
    this.loadSurvey();
  }

  nextQuestion = () => {

    this.setState({

      currentQuestion: this.state.currentQuestion + 1
    });

  }

  componentDidUpdate(prevProps, prevState) {
    const { currentQuestion } = this.state;
    if (this.state.currentQuestion !== prevState.currentQuestion) {
      this.setState(() => {
        return {
          questions: QuestionData[currentQuestion].question,
          options: QuestionData[currentQuestion].options,
          answers: QuestionData[currentQuestion].answer
        }
      })
    }
  }


  setAnswer = answer => {
    this.setState({
      userAnswer: answer
    })
    console.log(answer)
  }

  setFinish = () => {
    if (this.state.currentQuestion === QuestionData.length - 1) {
      this.setState({
        quizEnd: true
      })
    }
  }

  render() {
    const { questions, options, currentQuestion, userAnswer, quizEnd } = this.state;

    if (quizEnd) {
      return (
        <div>
          <h2>Thanks for taking our Survey!</h2>
          <Button variant="primary" href="/Home">
            Home
                    </Button>
        </div>
      )
    }
    return (
      <div className="App">
        <h1>SURVEY</h1>
        <h4>{questions}</h4>
        <span>Questions  {currentQuestion + 1}  out of {QuestionData.length} </span>

        {options.map(option => (
          <p key={option.id}
            className={userAnswer === option ? "selected" : null}
            onClick={() => this.setAnswer(option)}
          >
            {option}
          </p>
        ))}

        {currentQuestion < QuestionData.length - 1 &&
          <button
            onClick={this.nextQuestion}
          >Next</button>
        }

        {currentQuestion === QuestionData.length - 1 &&
          <button
            onClick={this.setFinish}
          >Finish</button>
        }
      </div>

    );
  }



  /* addQuestion(){
      AXIOS.post("http://localhost:4000/survey",{
          this.state.questions}
      })
  } ============================================*/ /*

  

}

export default Quiz; ============================================================*/

import React from 'react';
import PropTypes from 'prop-types';
import Question from '../components/Question';
import QuestionCount from '../components/QuestionCount';
import AnswerOption from '../components/AnswerOption'
import "../styles/SurveyQuiz.css";

import { CSSTransitionGroup } from 'react-transition-group';

function Quiz(props) {
  console.log("in quiz class " + props);
    function renderAnswerOptions(key) {
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
      
      return (
       // <CSSTransitionGroup
       <div
          className="container"
          component="div"
          transitionName="fade"
          transitionEnterTimeout={800}
          transitionLeaveTimeout={500}
          transitionAppear
          transitionAppearTimeout={500}
        >
        {/*props.questionId ? props.questionTotal : <button>Done</button>*/}
          <div key={props.questionId}>
            <QuestionCount
              counter={props.questionId}
              total={props.questionTotal}
            />
            <Question content={props.question} />
            <ul className="answerOptions">
              {props.answerOptions.map(renderAnswerOptions)}
              {console.log("after map: " + props.answerOptions)}
            </ul>
          </div>
        </div>//</CSSTransitionGroup>
      );
}

Quiz.propTypes = {
  answer: PropTypes.string.isRequired,
  answerOptions: PropTypes.array.isRequired,
  counter: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired
};

export default Quiz;