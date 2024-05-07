/* eslint-disable react-hooks/exhaustive-deps */
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavHeader from "./components/NavHeader";
import QuestionsTitle from "./components/QuestionsTitle";
import QuestionsComponent from "./components/QuestionsComponent";
import QuestionDescription from "./components/QuestionDescription";
import Answers from "./components/AnswersComponents";
import MyFooter from "./components/MyFooter";
import LoadingBar from "./components/LoadingBar";
import NotFoundPage from "./components/NotFoundPage";
import LoginForm from "./components/LoginForm";
import API from "./API";
import AuthContext from "./components/context/AuthContext";

function App() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [scoreState, setScoreState] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [successMsgTimeOutID, setSuccessMsgTimeOutID] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [navbarLoginState, setNavbarLoginState] = useState(true);
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reloadPage, setReloadPage] = useState(true);

  const handleError = (error) => {
    console.log(`**Errore catturato: ${error}**`);
    const errore = "Si è verificato un errore. Riprova...";
    setErrorMsg({ message: errore, variant: "deleted" });
    setTimeout(() => setErrorMsg(""), 4000);
    setDirty(true);
  };

  useEffect(() => {
    // Controllo se l'utente è loggato ogni volta che si carica la pagina
    API.getCurrentUser().then((user) => {
      setUser(user);
      setIsLoggedIn(true);
    });
    // .catch((error) => {
    // NO need to do anything in case of error: user is simply not yet authenticated
    // handleError(error);
    // });
  }, []);

  useEffect(() => {
    API.getQuestions()
      .then((questions) => {
        setQuestions(questions);
        setLoading(false);
        setDirty(false);
      })
      .catch((error) => handleError(error));
  }, [dirty]);

  const getQuestionById = (question, navigate = null) => {
    API.getQuestionById(question.id)
      .then((question) => {
        setQuestion(question);
        setLoading(true);
        setDirty(true);
        setReloadPage(false);
        navigate(`/questions/${question.id}/answers`);
      })
      .catch((error) => {
        if (error === "Question non trovata nel database.") {
          return navigate("/notfoundpage");
        }
        handleError(error);
      });
  };

  useEffect(() => {
    if (dirty) {
      if (question == "") {return;}
      API.getAnswersByQuestionId(question.id)
        .then((answers) => {
          setAnswers(answers);
          setLoading(false);
          setDirty(false);
        })
        .catch((error) => handleError(error));
    }
  }, [dirty]);

  const addAnswer = (newAnswer) => {
    newAnswer.question_id = question.id;
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
          message_answersComponent: "Risposta aggiunta correttamente!",
          variant: "added",
        });
        const id = setTimeout(() => setSuccessMsg(""), 4000);
        setSuccessMsgTimeOutID(id);
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
          message_answersComponent: "Risposta aggiornata correttamente!",
          variant: "updated",
        });
        const id = setTimeout(() => setSuccessMsg(""), 4000);
        setSuccessMsgTimeOutID(id);
        setDirty(true);
      })
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
          message_answersComponent: "Risposta eliminata correttamente!",
          variant: "deleted",
        });
        const id = setTimeout(() => setSuccessMsg(""), 4000);
        setSuccessMsgTimeOutID(id);
        setDirty(true);
      })
      .catch((error) => handleError(error));
  };

  const deleteQuestion = (id) => {
    setQuestions((oldQuestions) =>
      oldQuestions.map((question) => {
        if (question.id === id) {
          return { ...question, status: "deleted" };
        } else {
          return question;
        }
      })
    );
    if (successMsg) {
      // Se è attivo un banner SuccessMsg allora svuoto il banner ed elimino il suo timeout. Poi ne avvio un altro con le istruzioni successive.
      setSuccessMsg(""); // Svuoto il banner
      clearTimeout(successMsgTimeOutID); // Elimino il timeout
    }
    API.deleteQuestion(id)
      .then(() => {
        setSuccessMsg({
          message_questionsComponent: "Domanda eliminata correttamente!",
          variant: "deleted",
        });
        const id = setTimeout(() => setSuccessMsg(""), 4000);
        setSuccessMsgTimeOutID(id);
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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        navbarLoginState,
        setNavbarLoginState,
      }}
    >
      <BrowserRouter>
        <NavHeader
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
          successMsgTimeOutID={successMsgTimeOutID}
          setSuccessMsgTimeOutID={setSuccessMsgTimeOutID}
          setErrorMsg={setErrorMsg}
        />
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <LoadingBar />
              ) : (
                <Container fluid className="mt-3">
                  <QuestionsTitle questions={questions} />
                  <QuestionsComponent
                    questions={questions}
                    deleteQuestion={deleteQuestion}
                    getQuestionById={getQuestionById}
                    successMsg={successMsg}
                    successMsgTimeOutID={successMsgTimeOutID}
                    setSuccessMsg={setSuccessMsg}
                    errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg}
                  />
                </Container>
              )
            }
          />
          <Route
            path="/questions/:id/answers"
            element={
              <>
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
                        errorMsg={errorMsg}
                        setErrorMsg={setErrorMsg}
                        getQuestionById={getQuestionById}
                        reloadPage={reloadPage}
                      />
                    </Container>
                    <MyFooter />
                  </>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              <LoginForm
                successMsg={successMsg}
                setSuccessMsg={setSuccessMsg}
                successMsgTimeOutID={successMsgTimeOutID}
                setSuccessMsgTimeOutID={setSuccessMsgTimeOutID}
              />
            }
          />
          <Route
            path="/*"
            element={
              <NotFoundPage
                setSuccessMsg={setSuccessMsg}
                setErrorMsg={setErrorMsg}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
