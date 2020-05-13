import React, {Component} from "react";
import {ButtonToolbar} from "react-bootstrap";
import Question from "../components/Question";
import quizQuestions from "../api/quizQuestions";
import Quiz from "../components/Quiz";
import Result from "../components/Result";
import { app } from "../utils/AxiosConfig";
import "../styles/SurveyQuiz.css";


class Survey extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {},
      result: ''
    };
  
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.completeQuiz = this.completeQuiz.bind(this);
  }

  componentDidMount() {
   // console.log("in didMount: " + this.state.answerOptions);\
    const showOptions = quizQuestions.map((question) => (question.answers));  

    this.setState({
      question: quizQuestions[0].question,
      answerOptions: showOptions[0]
    });
    
  }
  
  onCreateFieldClick= e => {
    this.setState({ addSurveyShow: true });
  }

  setUserAnswer(answer) {
    this.setState((state) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: ''
    });
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 400);
      } else {
        setTimeout(() => this.setResults(this.getResults()), 400);
      }
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);
  
    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }

  setResults (result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  renderQuiz() {
    return (
      <Quiz
      answer={this.state.answer}
      answerOptions={this.state.answerOptions}
      questionId={this.state.questionId}
      question={this.state.question}
      questionTotal={quizQuestions.length}
      onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }
  
    renderResult() {
      return (
        <div>
         <Result quizResult={this.state.result} />
          <button className="buttonComplete" onClick={this.completeQuiz}>Done</button>
        </div>
      );
    }

    completeQuiz() {
      let answers = {
        trip_id: JSON.parse(localStorage.getItem("trip"))._id,
        user_id: JSON.parse(localStorage.getItem("user"))._id,
        destination: JSON.parse(localStorage.getItem("trip")).destination,
        quizQuestions: [
          {
              question: 'What type of activities do you want to experience on this trip?',
              answers: [
                  {
                      content: "Hiking"
                  },
                  {
                      content: "Shopping"
                  },
                  {
                      content: "Dining"
                  },
                  {
                      content: "Relaxing"
                  }
              ]
          },
          {
              question: 'Which attractions do you like to see?',
              answers: [
                  {
                      content: "Museums"
                  },
                  {
                      content: "Concerts"
                  },
                  {
                      content: "Local Festivals"
                  },
                  {
                      content: "Free Events"
                  }
              ]
          },
          {
              question: 'What is type of cuisine are you interested in trying for this trip?',
              answers: [
                  {
                      content: "African"
                  },
                  {
                      content: "American"
                  },
                  {
                      content: "Asian"
                  },
                  {
                      content: "European"
                  }
              ]
          },
          {
              question: 'What is your price level?',
              answers: [
                  {
                      content: "$"
                  },
                  {
                      content: "$$"
                  },
                  {
                      content: "$$$"
                  },
                  {
                      content: "$$$$"
                  }
              ]
          },
          {
              question: 'What is your budget for this trip?',
              answers: [
                  {
                      content: "under $500"
                  },
                  {
                      content: "$500-$1000"
                  },
                  {
                      content: "$1000-$5000"
                  },
                  {
                      content: "$5000 or more"
                  }
              ]
          }
        ]
      };

      app.post("question", answers)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.recs);
        let tripGET = JSON.parse(localStorage.getItem("trip"));
        let tripPUSH = {
          trip_locations: response.data.recs,
          _id: tripGET._id,
          owner_id: JSON.parse(localStorage.getItem("user"))._id,
          trip_name: tripGET.trip_name,
          destination: tripGET.destination,
          start_date: tripGET.start_date,
          end_date: tripGET.end_date,
          __v: 0,
        };
        // console.log(this.state.trip_id);
        // console.log(response.data.survey);
        // localStorage.setItem("survey", JSON.stringify(response.data.survey));
        // console.log(JSON.parse(localStorage.getItem("trip"))._id);
        let iddd = JSON.parse(localStorage.getItem("trip"))._id;
        localStorage.removeItem("trip");
        window.location = "/trip/" + iddd;
      })
      .catch((error) => {
        console.log(error);
      });
    }

  render() {
    console.log("in render");
   return (
    <div className="App">
      <div className="App-header">
        <h2>Survey</h2>
      </div>
      
      {this.state.result ? this.renderResult() : this.renderQuiz()}
    </div>
    );
  }
}

export default Survey;
