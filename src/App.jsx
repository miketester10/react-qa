import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { useState } from "react";
import { Question } from "./QAModels.mjs";
import NavHeader from "./components/NavHeader";
import QuestionDescription from "./components/QuestionDescription";
import Answers from "./components/AnswersComponents";
import MyFooter from "./components/MyFooter";

const fakeQuestion = new Question(
  1,
  "Is JavaScript better than Python?",
  "mike@polito.it",
  "2024-03-01"
);
fakeQuestion.init();
const fakeAnswers = fakeQuestion.getAnswers();

function App() {
  const [answers, setAnswers] = useState([...fakeAnswers]);
  const [scoreState, setScoreState] = useState("asc");

  const addScore = (id) => {
    setAnswers((oldAnswers) =>
      oldAnswers.map((answer) => {
        if (answer.id === id) {
          return { ...answer, score: answer.score + 1 };
        } else {
          return answer;
        }
      })
    );
  };

  const deleteAnswer = (id) => {
    setAnswers((oldAnswers) => oldAnswers.filter((answer) => answer.id !== id));
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
      <NavHeader questionNum={fakeQuestion.id} />
      <Container fluid className="mt-3">
        <QuestionDescription question={fakeQuestion} />
        <Answers
          answers={answers}
          setAnswers={setAnswers}
          scoreState={scoreState}
          sortAnswers={sortAnswers}
          addScore={addScore}
          deleteAnswer={deleteAnswer}
        />
      </Container>
      <MyFooter />
    </>
  );
}

export default App;
