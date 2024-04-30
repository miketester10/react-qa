/* eslint-disable react-hooks/exhaustive-deps */
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
  const [scoreState, setScoreState] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [successMsgTimeOutID, setSuccessMsgTimeOutID] = useState(null);

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
          if (successMsg) {
            setSuccessMsg((oldObj) => ({ ...oldObj, state: true }));
            const id = setTimeout(() => setSuccessMsg(""), 4000);
            setSuccessMsgTimeOutID(id);
          }
        })
        .catch((error) => handleError(error));
    }
  }, [dirty]);

  const addAnswer = (newAnswer) => {
    newAnswer.question_id = question_id;
    newAnswer.status = "added";
    setAnswers((oldAnswers) => {
      const temporary_key =
        Math.max(...oldAnswers.map((elemento) => elemento.id)) + 1; // Create a new temporary id for the key in map function in <Answers Row/>, waiting for a truly unique id that can only be supplied by the server. This temporary id will be replaced when the server will provide its id.
      newAnswer.id = temporary_key;
      return [...oldAnswers, newAnswer];
    });
    if (successMsg) {
      // Se è attivo un banner SuccessMsg allora svuoto il banner ed elimino il suo timeout. Poi ne avvio un altro con le istruzioni successive.
      setSuccessMsg(""); // Svuoto il banner
      clearTimeout(successMsgTimeOutID); // Elimino il timeout
    }
    API.addAnswer(newAnswer)
      .then(() => {
        setSuccessMsg({
          message: "Risposta aggiunta correttamente!",
          variant: "added",
          state: false,
        });
        setDirty(true);
      })
      .catch((error) => handleError(error));
  };

  const editAnswer = (editedAnswer) => {
    editedAnswer.status = "updated";
    setAnswers((oldAnswers) =>
      oldAnswers.map((answer) => {
        if (answer.id === editedAnswer.id) {
          return editedAnswer;
        } else {
          return answer;
        }
      })
    );
    if (successMsg) {
      // Se è attivo un banner SuccessMsg allora svuoto il banner ed elimino il suo timeout. Poi ne avvio un altro con le istruzioni successive.
      setSuccessMsg(""); // Svuoto il banner
      clearTimeout(successMsgTimeOutID); // Elimino il timeout
    }
    API.editAnswer(editedAnswer)
      .then(() => {
        setSuccessMsg({
          message: "Risposta aggiornata correttamente!",
          variant: "updated",
          state: false,
        });
        setDirty(true);
      })
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
    if (successMsg) {
      // Se è attivo un banner SuccessMsg allora svuoto il banner ed elimino il suo timeout. Poi ne avvio un altro con le istruzioni successive.
      setSuccessMsg(""); // Svuoto il banner
      clearTimeout(successMsgTimeOutID); // Elimino il timeout
    }
    API.deleteAnswer(id)
      .then(() => {
        setSuccessMsg({
          message: "Risposta eliminata correttamente!",
          variant: "deleted",
          state: false,
        });
        setDirty(true);
      })
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
              editAnswer={editAnswer}
              scoreState={scoreState}
              sortAnswers={sortAnswers}
              addScore={addScore}
              deleteAnswer={deleteAnswer}
              successMsg={successMsg}
              successMsgTimeOutID={successMsgTimeOutID}
              setSuccessMsg={setSuccessMsg}
            />
          </Container>
          <MyFooter />
        </>
      )}
    </>
  );
}

export default App;
