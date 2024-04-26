/* eslint-disable react/prop-types */
import "bootstrap-icons/font/bootstrap-icons.css";
import { Col, Row, Table, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { AddAnswerForm, EditAnswerForm } from "./Forms";

function Answers(props) {
  const [showAddAnswerForm, setShowAddAnswerForm] = useState(false);
  const [showEditAnswerForm, setShowEditAnswerForm] = useState(false);
  const [answerToEdit, setAnswerToEdit] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [timeOutID, setTimeOutID] = useState(null);

  return (
    <>
      <Row>
        <Col as="h2" className="mt-2">
          Answers:
        </Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          {successMsg ? (
            <Alert
              className="text-center"
              variant="success"
              onClose={() => {
                setSuccessMsg(""), clearTimeout(timeOutID);
              }}
              dismissible
            >
              {successMsg}
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
            setAnswerToEdit={setAnswerToEdit}
          ></AnswersTable>
        </Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          <AddAnswerForm
            answers={props.answers}
            setAnswers={props.setAnswers}
            showAddAnswerForm={showAddAnswerForm}
            showEditAnswerForm={showEditAnswerForm}
            setShowAddAnswerForm={setShowAddAnswerForm}
            setShowEditAnswerForm={setShowEditAnswerForm}
            setSuccessMsg={setSuccessMsg}
            setTimeOutID={setTimeOutID}
          />
          {showEditAnswerForm && (
            <EditAnswerForm
              setAnswers={props.setAnswers}
              answerToEdit={answerToEdit}
              setShowEditAnswerForm={setShowEditAnswerForm}
              setSuccessMsg={setSuccessMsg}
              setTimeOutID={setTimeOutID}
            />
          )}
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
            setAnswerToEdit={props.setAnswerToEdit}
          />
        ))}
      </tbody>
    </Table>
  );
}

function AnswerRow(props) {
  return (
    <tr>
      <AnswerData answer={props.answer} />
      <AnswerActions
        answer={props.answer}
        addScore={props.addScore}
        setShowAddAnswerForm={props.setShowAddAnswerForm}
        setShowEditAnswerForm={props.setShowEditAnswerForm}
        deleteAnswer={props.deleteAnswer}
        setAnswerToEdit={props.setAnswerToEdit}
      />
    </tr>
  );
}

function AnswerData(props) {
  return (
    <>
      <td>{props.answer.date.format("YYYY-MM-DD")}</td>
      <td>{props.answer.text}</td>
      <td>{props.answer.email}</td>
      <td>{props.answer.score}</td>
    </>
  );
}

function AnswerActions(props) {
  return (
    <td>
      <Button variant="warning" onClick={() => props.addScore(props.answer.id)}>
        <i className="bi bi-arrow-up"></i>
      </Button>
      <Button
        variant="primary"
        className="mx-1"
        onClick={() => {
          props.setShowAddAnswerForm(false),
            props.setShowEditAnswerForm(true),
            props.setAnswerToEdit(props.answer);
        }}
      >
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
