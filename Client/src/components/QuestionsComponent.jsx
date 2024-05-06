/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Alert, Col, Row, Table, Button } from "react-bootstrap";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";

function Questions(props) {
  const { setNavbarLoginState } = useContext(AuthContext);

  const location = useLocation();
  useEffect(() => {
    setNavbarLoginState(true);
  }, [location]);

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
          />
        </Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          {/* <AddAnswerForm />
          <EditAnswerForm /> */}
        </Col>
      </Row>
    </>
  );
}

function QuestionsTable(props) {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Asked</th>
          <th>Text</th>
          <th>Author</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.questions.map((question) => (
          <AnswerRow
            key={question.id}
            question={question}
            getQuestionById={props.getQuestionById}
            // addScore={props.addScore}
            // deleteAnswer={props.deleteAnswer}
            // setShowAddAnswerForm={props.setShowAddAnswerForm}
            // setShowEditAnswerForm={props.setShowEditAnswerForm}
            // setObj={props.setObj}
          />
        ))}
      </tbody>
    </Table>
  );
}

function AnswerRow(props) {
  return (
    <tr>
      <AnswerData
        question={props.question}
        getQuestionById={props.getQuestionById}
      />
      <AnswerActions
        question={props.question}
        // addScore={props.addScore}
        // setShowAddAnswerForm={props.setShowAddAnswerForm}
        // setShowEditAnswerForm={props.setShowEditAnswerForm}
        // deleteAnswer={props.deleteAnswer}
        // setObj={props.setObj}
      />
    </tr>
  );
}

function AnswerData(props) {
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

function AnswerActions(props) {
  return (
    <td className={"col-lg-2"}>
      <Button variant="primary" className="mx-1">
        <i className="bi bi-pencil-square"></i>
      </Button>
      <Button variant="danger">
        <i className="bi bi-trash"></i>
      </Button>
    </td>
  );
}

export default Questions;
