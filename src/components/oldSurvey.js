import React, { Component } from "react";
import { Modal, Button, ButtonToolbar } from "react-bootstrap";
/* import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap"; */
import { app } from "../utils/AxiosConfig";
import "../styles/SurveyQuiz.css";

import quizQuestions from "../api/quizQuestions";
import Quiz from "../components/Quiz";
import Result from "../components/Result";
//const AXIOS = require("axios").default;
class oldSurvey extends Component {
  //import Question from './components/Question';
/*========================================================================================
  constructor(props) {
    super(props);
    this.state = {
      questions: [
    {
        questionId: 0,
        question: 'What type of activities do you want to experience on this trip?',
        options: ['Hiking', 'Shopping', 'Dining', 'Relaxing'],
        answer: ''
    },
    {
        questionId: 1,
        question: 'Which attractions do you like to see?',
        options: ['Museums', 'Concerts', 'Local Festivals', 'Free Events'],
        answer: ''
    },
    {
        questionId: 2,
        question: 'What is type of cuisine are you interested in trying for this trip?',
        options: ['African', 'American', 'Asian', 'European'],
        answer: ''
    },
    {
        questionId: 3,
        question: 'What is your price level?',
        options: ['$', '$$', '$$$', '$$$$'],
        answer: ''
    },
    {
        questionId: 4,
        question: 'What is your budget for this trip?',
        options: ['under $500', '$500-$1000', '$1000-$5000', '$5000 or more'],
        answer: ''
    }
      ]
    };
    this.handleChange = this.handleChange.bind(this);
==============================================================================================================
    * AXIOS.create({
             baseURL: 'http://localhost:4000/trip/survery'});
 
         AXIOS.post('http://localhost:4000/trip/survey', this.state)
             .then(response => {
                 console.log(response)
             })
             .catch(error => {
                 console.log(error)
             })
         *====================================================================================================/
  }

  handleChange(e) {
    let id = e.target.questionId;
    let input = e.target.value;
    this.setState({});
    this.saveAnswer(e);
    console.log(this.state);
  }

  saveAnswer(e) {
    e.preventDefault();
  }

  handleSubmit = () => {
    let answers = {
      trip_id: JSON.parse(localStorage.getItem("trip"))._id,
      user_id: JSON.parse(localStorage.getItem("user"))._id,
      destination: JSON.parse(localStorage.getItem("trip")).destination,
      questions: [
        {
            questionId: 0,
            question: 'What type of activities do you want to experience on this trip?',
            options: ['Hiking', 'Shopping', 'Dining', 'Relaxing'],
            answer: ''
        },
        {
            questionId: 1,
            question: 'Which attractions do you like to see?',
            options: ['Museums', 'Concerts', 'Local Festivals', 'Free Events'],
            answer: ''
        },
        {
            questionId: 2,
            question: 'What is type of cuisine are you interested in trying for this trip?',
            options: ['African', 'American', 'Asian', 'European'],
            answer: ''
        },
        {
            questionId: 3,
            question: 'What is your price level?',
            options: ['$', '$$', '$$$', '$$$$'],
            answer: ''
        },
        {
            questionId: 4,
            question: 'What is your budget for this trip?',
            options: ['under $500', '$500-$1000', '$1000-$5000', '$5000 or more'],
            answer: ''
        }
      ]
    };
    app
      .post("question", answers)
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
  };
  ========================================================================*/


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

  async componentDidMount() {
    console.log("in didMount ");
    const shuffledAnswerOptions = quizQuestions.map((question) => (question.answers));  

    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
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
    console.log("in renderQuiz");
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
         {/* <Result quizResult={this.state.result} />*/}
          <button className="buttonComplete" onClick={this.completeQuiz}>Done</button>
        </div>
      );
    }

    completeQuiz() {
      let answers = {
        trip_id: JSON.parse(localStorage.getItem("trip"))._id,
        user_id: JSON.parse(localStorage.getItem("user"))._id,
        destination: JSON.parse(localStorage.getItem("trip")).destination
      }

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
        let iddd = JSON.parse(localStorage.getItem("trip"))._id;
        localStorage.removeItem("trip");
        window.location = "/trip/" + iddd;
      })
      .catch((error) => {
        console.log(error);
      });
    }

  
  /*========================================================================================*/

  render() {
    console.log("In render!");
    console.log(quizQuestions.answerOptions);
    return (
      /*===============================================================================================
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            value="./images/TRIPPIN.png"
          >
            <img
              className="logo"
              src={require("./images/TRIPPIN.png")}
              width="50px"
              height="50px"
            />
            SURVEY
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="question">
            <form onSubmit={this.handleSubmit}>
              {/* <div>{this.state.questions.map((question, i) => (<div key={question.questionId}>
                                <div>{question.questionId}. {question.question}</div>
                                <div><input type='text' placeholder='Enter answer' value={this.state.questions[i].answer} onChange={this.handleChange} /></div>
                            </div>))} ======================================================}
              <div>
                <div>
                  What type of activities do you want to experience on this
                  trip?
                </div>
                <input id="answer1" type="text"></input>
              </div>
              <div>
                <div>
                  Which attractions do you like to see?
                </div>
                <input id="answer2" type="text"></input>
              </div>
              <div>
                <div>
                  What is type of cuisine are you interested in trying for this
                  trip?
                </div>
                <input id="answer3" type="text"></input>
              </div>
              <div>
                <div>What is your price level in term of ($-$$$$) sign?</div>
                <input id="answer4" type="text"></input>
              </div>
              <div>
                <div>What is your budget for this trip?</div>
                <input id="answer5" type="text"></input>
              </div>
              
              <ButtonToolbar>
                <Button onClick={this.handleSubmit}>SAVE</Button>
              </ButtonToolbar>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.props.onHide}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
      ==================================================================================*/


      <div className="App">
      <div className="App-header">
        <h2>Survey</h2>
      </div>
      
      {this.state.result ? this.renderResult() : this.renderQuiz()}
     {/* <Quiz
        //answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        //questionTotal={quizQuestions.length}
        //onAnswerSelected={this.handleAnswerSelected}
     />*/}
    </div>
    );
  }

  /* addQuestion(){
        AXIOS.post("http://localhost:4000/survey",{
            this.state.questions}
        })
    } */
}

export default oldSurvey;
