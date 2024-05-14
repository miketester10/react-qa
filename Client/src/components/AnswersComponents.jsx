/* eslint-disable react/prop-types */
import "bootstrap-icons/font/bootstrap-icons.css";
import { Col, Row, Table, Button, Alert } from "react-bootstrap";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AddAnswerForm, EditAnswerForm } from "./AnswerForm";
import AuthContext from "./context/AuthContext";

function Answers(props) {
  const [showAddAnswerForm, setShowAddAnswerForm] = useState(false);
  const [showEditAnswerForm, setShowEditAnswerForm] = useState(false);
  const [obj, setObj] = useState("");
  const { isLoggedIn } = useContext(AuthContext);

  const { questionId } = useParams();
 
  const navigate = useNavigate();
  useEffect(() => {
    if (props.reloadPage) {
      const question = { id: questionId };
      props.getQuestionById(question, navigate);
    }
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
        <Col as="p">
          <span style={{ fontStyle: "sans-serif", fontSize: "16px" }}>
            <strong>Answers {`(${props.answers.length})`}: </strong>
          </span>
        </Col>
      </Row>
      {props.answers.length === 0 && !isLoggedIn ? (
        <Row>
          <Col as="p">
            <em>
              No answer present.{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Be the first.
              </Link>
            </em>
          </Col>
        </Row>
      ) : (
        <>
          {props.answers.length === 0 ? null : (
            <Row>
              <Col lg={10} className="mx-auto">
                {props.successMsg.message_answersComponent || props.errorMsg ? (
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
                    {props.successMsg.message_answersComponent ||
                      props.errorMsg.message}
                  </Alert>
                ) : null}

                <AnswersTable
                  answers={props.answers}
                  scoreState={props.scoreState}
                  sortAnswers={props.sortAnswers}
                  addScore={props.addScore}
                  deleteAnswer={props.deleteAnswer}
                  setShowAddAnswerForm={setShowAddAnswerForm}
                  setShowEditAnswerForm={setShowEditAnswerForm}
                  setObj={setObj}
                ></AnswersTable>
              </Col>
            </Row>
          )}

          <Row>
            <Col
              lg={10}
              className={props.answers.length === 0 ? "mx-6" : "mx-auto"}
            >
              <AddAnswerForm
                addAnswer={props.addAnswer}
                showAddAnswerForm={showAddAnswerForm}
                showEditAnswerForm={showEditAnswerForm}
                setShowAddAnswerForm={setShowAddAnswerForm}
                setShowEditAnswerForm={setShowEditAnswerForm}
              />
              <EditAnswerForm
                // key = {obj.id} // se non voglio usare useEffect all'interno di EditAnswerForm per modificare i campi del form ogni volta che premo il bottone di Edit
                editAnswer={props.editAnswer}
                showEditAnswerForm={showEditAnswerForm}
                setShowEditAnswerForm={setShowEditAnswerForm}
                obj={obj}
                setObj={setObj}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

function AnswersTable(props) {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Answered</th>
          <th>Text</th>
          <th>Author</th>
          <th>
            Score
            {props.scoreState === "asc" && (
              <i
                className="bi bi-sort-numeric-up"
                onClick={() => props.sortAnswers("asc")}
              ></i>
            )}
            {props.scoreState === "desc" && (
              <i
                className="bi bi-sort-numeric-down-alt"
                onClick={() => props.sortAnswers("desc")}
              ></i>
            )}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.answers.map((answer) => (
          <AnswerRow
            key={answer.id}
            answer={answer}
            addScore={props.addScore}
            deleteAnswer={props.deleteAnswer}
            setShowAddAnswerForm={props.setShowAddAnswerForm}
            setShowEditAnswerForm={props.setShowEditAnswerForm}
            setObj={props.setObj}
          />
        ))}
      </tbody>
    </Table>
  );
}

function AnswerRow(props) {
  let statusClass = null;

  switch (props.answer.status) {
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
      <AnswerData answer={props.answer} />
      <AnswerActions
        answer={props.answer}
        addScore={props.addScore}
        setShowAddAnswerForm={props.setShowAddAnswerForm}
        setShowEditAnswerForm={props.setShowEditAnswerForm}
        deleteAnswer={props.deleteAnswer}
        setObj={props.setObj}
      />
    </tr>
  );
}

function AnswerData(props) {
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
      <td className="col-lg-2">{handleDate(props.answer.date)}</td>
      <td>{props.answer.text}</td>
      <td className="col-lg-3">{props.answer.respondent}</td>
      <td className="col-lg-1">{props.answer.score}</td>
    </>
  );
}

function AnswerActions(props) {
  const { user, isLoggedIn } = useContext(AuthContext);

  const handleEditClick = () => {
    // Creo un nuovo oggetto con tutte le proprietà da aggiornare
    const objToEdit = {
      id: props.answer.id,
      date: props.answer.date,
      text: props.answer.text,
      author: props.answer.respondent,
      score: props.answer.score,
      user_id: props.answer.user_id,
    };

    // Metto l'oggetto da modificare (objToEdit) in obj cosi da poterlo passare al form di modifica.
    props.setObj(objToEdit);

    // Metto a false il form di aggiunta risposta così se era aperto si chiude e metto a true il form di modifica risposta per renderlo visibile
    props.setShowAddAnswerForm(false);
    props.setShowEditAnswerForm(true);
  };

  return (
    <td
      className={
        isLoggedIn && user.id === props.answer.user_id ? "col-lg-2" : "col-lg-1"
      }
      style={isLoggedIn ? {} : { textAlign: "center" }}
    >
      <Button variant="warning" onClick={() => props.addScore(props.answer.id)}>
        <i className="bi bi-arrow-up"></i>
      </Button>
      {user.id === props.answer.user_id && (
        <>
          <Button variant="primary" className="mx-1" onClick={handleEditClick}>
            <i className="bi bi-pencil-square"></i>
          </Button>
          <Button
            variant="danger"
            onClick={() => props.deleteAnswer(props.answer.id)}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </>
      )}
    </td>
  );
}
export default Answers;
