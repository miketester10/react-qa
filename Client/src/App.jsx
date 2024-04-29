import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import NavHeader from "./components/NavHeader";
import QuestionDescription from "./components/QuestionDescription";
import Answers from "./components/AnswersComponents";
import MyFooter from "./components/MyFooter";
import LoadingBar from "./components/LoadingBar";
import API from "./API";

function App() {
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [scoreState, setScoreState] = useState("desc");

  const handleError = (error) => {
    console.log(`**Errore catturato: ${error}**`);
  };

  const question_id = 1;

  useEffect(() => {
    API.getQuestionById(question_id)
      .then((question) => {
        setQuestion(question);
      })
      .catch((error) => handleError(error));
  }, []);

  useEffect(() => {
    if (dirty) {
      API.getAnswersByQuestionId(question_id)
        .then((answers) => {
          setAnswers(answers);
          setLoading(false);
          setDirty(false);
        })
        .catch((error) => handleError(error));
    }
  }, [dirty]);

  const addAnswer = (newAnswer) => {
    newAnswer.question_id = question_id;
    newAnswer.status = "added";
    setAnswers((oldAnswers) => {
      console.log(oldAnswers);
      const temporary_key = Math.max(...oldAnswers.map((elemento) => elemento.id)) + 1; // Create a new temporary id for the key in map function in <Answers Row/>, waiting for a truly unique id that can only be supplied by the server. This temporary id will be replaced when the server will provide its id.
      newAnswer.id = temporary_key;
      return [...oldAnswers, newAnswer];
    });
    console.log(newAnswer);
    API.addAnswer(newAnswer)
      .then(() => setDirty(true))
      .catch((error) => handleError(error));
  };

  const addScore = (id) => {
    setAnswers((oldAnswers) =>
      oldAnswers.map((answer) => {
        if (answer.id === id) {
          return { ...answer, score: answer.score + 1, status: "updated" };
        } else {
          return answer;
        }
      })
    );
    API.voteAnswer(id)
      .then(() => setDirty(true))
      .catch((error) => handleError(error));
  };

  const deleteAnswer = (id) => {
    setAnswers((oldAnswers) =>
      oldAnswers.map((answer) => {
        if (answer.id === id) {
          return { ...answer, status: "deleted" };
        } else {
          return answer;
        }
      })
    );
    API.deleteAnswer(id)
      .then(() => setDirty(true))
      .catch((error) => handleError(error));
  };

  const sortAnswers = (state) => {
    if (state === "asc") {
      setAnswers((oldAnswers) => oldAnswers.sort((a, b) => b.score - a.score));
      setScoreState("desc");
    } else {
      setAnswers((oldAnswers) => oldAnswers.sort((a, b) => a.score - b.score));
      setScoreState("asc");
    }
  };

  return (
    <>
      <NavHeader />
      {loading ? (
        <LoadingBar />
      ) : (
        <>
          <Container fluid className="mt-3">
            <QuestionDescription question={question} />
            <Answers
              answers={answers}
              addAnswer={addAnswer}
              // setAnswers={setAnswers}
              scoreState={scoreState}
              sortAnswers={sortAnswers}
              addScore={addScore}
              deleteAnswer={deleteAnswer}
            />
          </Container>
          <MyFooter />
        </>
      )}
    </>
  );
}

export default App;
