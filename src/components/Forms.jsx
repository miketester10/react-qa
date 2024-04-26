/* eslint-disable react/prop-types */
import { Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Answer } from "../QAModels.mjs";

function AddAnswerForm(props) {
  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [score, setScore] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timeOutID, setTimeOutID] = useState(null);

  const handleDate = (event) => {
    const value = event.target.value;
    setDate(value);
  };

  const handleText = (event) => {
    const value = event.target.value;
    setText(value);
  };

  const handleAuthor = (event) => {
    const value = event.target.value;
    setAuthor(value);
  };

  const handleScore = (event) => {
    const value = event.target.value;
    setScore(value);
  };

  const handleSubmitAddAnswer = (event) => {
    event.preventDefault();
    // Form validation
    if (!text || !author || !date || score === "") {
      setErrorMsg("Tutti i campi devono essere compilati.");
      const idTimeoutErrorMsg = setTimeout(() => setErrorMsg(""), 3000);
      setTimeOutID(idTimeoutErrorMsg);
      return;
    }
    const newAnswer = new Answer(
      props.answers.length + 1,
      text,
      author,
      date,
      score
    );
    props.setAnswers((oldAnswers) => [...oldAnswers, newAnswer]);
    setDate("");
    setText("");
    setAuthor("");
    setScore("");
    props.setShowAddAnswerForm(false);
    props.setSuccessMsg("Domanda aggiunta correttamente.");
    const idTimeOutSuccessMsg = setTimeout(() => props.setSuccessMsg(""), 3000);
    props.setTimeOutID(idTimeOutSuccessMsg);
  };

  return (
    <>
      {errorMsg ? (
        <Alert
          className="text-center"
          variant="danger"
          onClose={() => {
            setErrorMsg(""), clearTimeout(timeOutID);
          }}
          dismissible
        >
          {errorMsg}
        </Alert>
      ) : null}

      {props.showAddAnswerForm ? (
        <Form onSubmit={handleSubmitAddAnswer}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={date} onChange={handleDate} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control as="textarea" value={text} onChange={handleText} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control type="text" value={author} onChange={handleAuthor} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Score</Form.Label>
            <Form.Control type="number" value={score} onChange={handleScore} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add
          </Button>
          <Button
            variant="secondary"
            className="mx-1"
            onClick={() => props.setShowAddAnswerForm(false)}
          >
            Close
          </Button>
        </Form>
      ) : (
        !props.showEditAnswerForm && (
          <Button
            variant="primary"
            onClick={() => {
              props.setShowAddAnswerForm(true),
                props.setShowEditAnswerForm(false);
            }}
          >
            Add Answer
          </Button>
        )
      )}
    </>
  );
}

function EditAnswerForm(props) {
  const [date, setDate] = useState(
    props.answerToEdit.date.format("YYYY-MM-DD")
  );
  const [text, setText] = useState(props.answerToEdit.text);
  const [author, setAuthor] = useState(props.answerToEdit.email);
  const [score, setScore] = useState(props.answerToEdit.score);
  const [errorMsg, setErrorMsg] = useState("");
  const [timeOutID, setTimeOutID] = useState(null);

  const handleDate = (event) => {
    const value = event.target.value;
    setDate(value);
  };

  const handleText = (event) => {
    const value = event.target.value;
    setText(value);
  };

  const handleAuthor = (event) => {
    const value = event.target.value;
    setAuthor(value);
  };

  const handleScore = (event) => {
    const value = event.target.value;
    setScore(value);
  };

  const handleSubmitEditAnswer = (event) => {
    event.preventDefault();
    // Form validation
    if (!text || !author || !date || score === "") {
      setErrorMsg("Tutti i campi devono essere compilati.");
      const idTimeOutErrorMsg = setTimeout(() => setErrorMsg(""), 3000);
      setTimeOutID(idTimeOutErrorMsg);
      return;
    }
    const editedAnswer = new Answer(
      props.answerToEdit.id,
      text,
      author,
      date,
      score
    );
    props.setAnswers((oldAnswers) =>
      oldAnswers.map((answer) =>
        answer.id === editedAnswer.id ? editedAnswer : answer
      )
    );
    props.setShowEditAnswerForm(false);
    props.setSuccessMsg("Domanda modificata correttamente.");
    const idTimeOutSuccessMsg = setTimeout(() => props.setSuccessMsg(""), 3000);
    props.setTimeOutID(idTimeOutSuccessMsg);
  };

  return (
    <>
      {errorMsg ? (
        <Alert
          className="text-center"
          variant="danger"
          onClose={() => {
            setErrorMsg(""), clearTimeout(timeOutID);
          }}
          dismissible
        >
          {errorMsg}
        </Alert>
      ) : null}

      <Form onSubmit={handleSubmitEditAnswer}>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" value={date} onChange={handleDate} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Text</Form.Label>
          <Form.Control as="textarea" value={text} onChange={handleText} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" value={author} onChange={handleAuthor} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Score</Form.Label>
          <Form.Control type="number" value={score} onChange={handleScore} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Edit
        </Button>
        <Button
          variant="secondary"
          className="mx-1"
          onClick={() => props.setShowEditAnswerForm(false)}
        >
          Close
        </Button>
      </Form>
    </>
  );
}

export { AddAnswerForm, EditAnswerForm };
