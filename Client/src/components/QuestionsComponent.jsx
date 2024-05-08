/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Alert, Col, Row, Table, Button } from "react-bootstrap";
import dayjs from "dayjs";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QuestionForm } from "./QuestionForm";
import AuthContext from "./context/AuthContext";

function Questions(props) {
  const [mode, setMode] = useState("view");
  const { setNavbarLoginState } = useContext(AuthContext);

  useEffect(() => {
    setNavbarLoginState(true);
  }, []);

  let variant = null;
  switch (props.successMsg.variant || props.errorMsg.variant) {
    case "added":
      variant = "success";
      break;
    case "deleted":
      variant = "danger";
      break;
    case "updated":
      variant = "warning";
      break;
    default:
      break;
  }

  return (
    <>
      <Row>
        <Col lg={10} className="mx-auto">
          {props.successMsg.message_questionsComponent || props.errorMsg ? (
            <Alert
              className="text-center"
              variant={variant}
              onClose={() => {
                props.setSuccessMsg("");
                clearTimeout(props.successMsgTimeOutID);
                props.setErrorMsg("");
              }}
              dismissible
            >
              {props.successMsg.message_questionsComponent ||
                props.errorMsg.message}
            </Alert>
          ) : null}
          <QuestionsTable
            questions={props.questions}
            getQuestionById={props.getQuestionById}
            deleteQuestion={props.deleteQuestion}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          {mode === "view" && (
            <Button variant="primary" onClick={() => setMode("add")}>
              Add Question
            </Button>
          )}
          {mode === "add" && (
            <QuestionForm
              addQuestion={(newQuestion) => {
                props.addQuestion(newQuestion);
                setMode("view");
              }}
              mode={mode}
              close={() => setMode("view")}
            />
          )}
          {mode === "edit" && (
            <QuestionForm mode={mode} close={() => setMode("view")} />
          )}
        </Col>
      </Row>
    </>
  );
}

function QuestionsTable(props) {
  const { isLoggedIn, user } = useContext(AuthContext);
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Asked</th>
          <th>Text</th>
          <th>Author</th>
          {isLoggedIn && props.questions.some((q) => q.user_id === user.id) ? (
            <th>Actions</th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {props.questions.map((question) => (
          <QuestionRow
            key={question.id}
            question={question}
            questions={props.questions}
            getQuestionById={props.getQuestionById}
            // addScore={props.addScore}
            deleteQuestion={props.deleteQuestion}
            // setShowAddAnswerForm={props.setShowAddAnswerForm}
            // setShowEditAnswerForm={props.setShowEditAnswerForm}
            // setObj={props.setObj}
          />
        ))}
      </tbody>
    </Table>
  );
}

function QuestionRow(props) {
  const { isLoggedIn, user } = useContext(AuthContext);

  let statusClass = null;

  switch (props.question.status) {
    case "added":
      statusClass = "table-success";
      break;
    case "deleted":
      statusClass = "table-danger";
      break;
    case "updated":
      statusClass = "table-warning";
      break;
    default:
      break;
  }

  return (
    <tr className={statusClass}>
      <QuestionData
        question={props.question}
        getQuestionById={props.getQuestionById}
      />
      {isLoggedIn && props.questions.some((q) => q.user_id === user.id) ? (
        <QuestionActions
          question={props.question}
          // addScore={props.addScore}
          // setShowAddAnswerForm={props.setShowAddAnswerForm}
          // setShowEditAnswerForm={props.setShowEditAnswerForm}
          deleteQuestion={props.deleteQuestion}
          // setObj={props.setObj}
        />
      ) : null}
    </tr>
  );
}

function QuestionData(props) {
  const navigate = useNavigate();
  const handleDate = (date) => {
    const initialDate = date;
    const currentDate = dayjs();
    const secondi = currentDate.diff(initialDate, "second");
    const minuti = currentDate.diff(initialDate, "minute");
    const ore = currentDate.diff(initialDate, "hour");
    const giorni = currentDate.diff(initialDate, "day");

    if (giorni > 4) {
      return `${date.format("MMM D, YYYY")}`;
    } else if (giorni > 0) {
      return giorni === 1 ? `${giorni} day ago` : `${giorni} days ago`;
    } else if (ore > 0) {
      return ore === 1 ? `${ore} hour ago` : `${ore} hours ago`;
    } else if (minuti > 0) {
      return minuti === 1 ? `${minuti} min ago` : `${minuti} mins ago`;
    } else {
      return secondi === 1 ? `${secondi} sec ago` : `${secondi} secs ago`;
    }
  };

  return (
    <>
      <td className="col-lg-2">{handleDate(props.question.date)}</td>
      <td>
        <Link
          style={{ textDecoration: "none" }}
          onClick={() => {
            props.getQuestionById(props.question, navigate);
          }}
        >
          {props.question.text}
        </Link>
      </td>
      <td className="col-lg-3">{props.question.email}</td>
    </>
  );
}

function QuestionActions(props) {
  const { user, isLoggedIn } = useContext(AuthContext);
  return (
    <td
      className={
        isLoggedIn && user.id === props.question.user_id
          ? "col-lg-1"
          : "col-lg-2"
      }
      style={isLoggedIn ? { textAlign: "center" } : {}}
    >
      {user.id === props.question.user_id && (
        <>
          <Button variant="primary" className="mx-1">
            <i className="bi bi-pencil-square"></i>
          </Button>
          <Button
            variant="danger"
            onClick={() => props.deleteQuestion(props.question.id)}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </>
      )}
    </td>
  );
}

export default Questions;
