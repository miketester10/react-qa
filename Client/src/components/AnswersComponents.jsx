/* eslint-disable react/prop-types */
import "bootstrap-icons/font/bootstrap-icons.css";
import { Col, Row, Table, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { AddAnswerForm, EditAnswerForm } from "./Forms";

function Answers(props) {
  const [showAddAnswerForm, setShowAddAnswerForm] = useState(false);
  const [showEditAnswerForm, setShowEditAnswerForm] = useState(false);
  const [obj, setObj] = useState("");

  let variant = null;
  switch (props.successMsg.variant) {
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
        <Col as="h2" className="mt-2">
          Answers:
        </Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          {props.successMsg.state ? (
            <Alert
              className="text-center"
              variant={variant}
              onClose={() => {
                props.setSuccessMsg("");
                clearTimeout(props.successMsgTimeOutID);
              }}
              dismissible
            >
              {props.successMsg.message}
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
      <Row>
        <Col lg={10} className="mx-auto">
          <AddAnswerForm
            addAnswer={props.addAnswer}
            showAddAnswerForm={showAddAnswerForm}
            showEditAnswerForm={showEditAnswerForm}
            setShowAddAnswerForm={setShowAddAnswerForm}
            setShowEditAnswerForm={setShowEditAnswerForm}
          />
          <EditAnswerForm
            editAnswer={props.editAnswer}
            showEditAnswerForm={showEditAnswerForm}
            setShowEditAnswerForm={setShowEditAnswerForm}
            obj={obj}
            setObj={setObj}
          />
        </Col>
      </Row>
    </>
  );
}

function AnswersTable(props) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Date</th>
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
            answer={answer}
            key={answer.id}
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
  return (
    <>
      <td>{props.answer.date.format("YYYY-MM-DD")}</td>
      <td>{props.answer.text}</td>
      <td>{props.answer.respondent}</td>
      <td>{props.answer.score}</td>
    </>
  );
}

function AnswerActions(props) {
  const handleEditClick = () => {
    // Creo un nuovo oggetto con tutte le proprietà da aggiornare
    const objToEdit = {
      id: props.answer.id,
      date: props.answer.date.format("YYYY-MM-DD"),
      text: props.answer.text,
      author: props.answer.respondent,
      score: props.answer.score,
    };

    // Metto l'oggetto da modificare (objToEdit) in obj cosi da poterlo passare al form di modifica.
    props.setObj(() => objToEdit);

    // Metto a false il form di aggiunta risposta così se era aperto si chiude e metto a true il form di modifica risposta per renderlo visibile
    props.setShowAddAnswerForm(false);
    props.setShowEditAnswerForm(true);
  };

  return (
    <td>
      <Button variant="warning" onClick={() => props.addScore(props.answer.id)}>
        <i className="bi bi-arrow-up"></i>
      </Button>
      <Button variant="primary" className="mx-1" onClick={handleEditClick}>
        <i className="bi bi-pencil-square"></i>
      </Button>
      <Button
        variant="danger"
        onClick={() => props.deleteAnswer(props.answer.id)}
      >
        <i className="bi bi-trash"></i>
      </Button>
    </td>
  );
}
export default Answers;
