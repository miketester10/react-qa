/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Form, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

function AddAnswerForm(props) {
  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [score, setScore] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timeOutID, setTimeOutID] = useState(null);

  /*** solo se voglio permettere all'utente di selezionare la data ***/
  // const handleDate = (event) => {        
  //   const value = event.target.value;
  //   setDate(value);
  // };

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
    if (errorMsg) {
      setErrorMsg("");
      clearTimeout(timeOutID);
    }

    // Form validation
    if (!text || !author || !date || score === "") {
      setErrorMsg("Tutti i campi devono essere compilati.");
      const idTimeoutErrorMsg = setTimeout(() => setErrorMsg(""), 3000);
      setTimeOutID(idTimeoutErrorMsg);
      return;
    }
    const newAnswer = {
      text: text,
      respondent: author,
      date: dayjs(date),
      score: parseInt(score),
    };
    props.addAnswer(newAnswer);
    props.setShowAddAnswerForm(false);
    clearForm();
  };

  const clearForm = () => {
    setDate("");
    setText("");
    setAuthor("");
    setScore("");
  };

  return (
    <>
      {errorMsg ? (
        <Alert
          className="text-center"
          variant="danger"
          onClose={() => {
            setErrorMsg("");
            clearTimeout(timeOutID);
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
            {/* <Form.Control type="date" value={date} onChange={handleDate} /> // solo se voglio permettere all'utente di selezionare la data */}
            <Form.Control type="date" value={date} disabled />
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
            onClick={() => {
              props.setShowAddAnswerForm(false);
              setErrorMsg("");
              clearTimeout(timeOutID);
              clearForm();
            }}
          >
            Close
          </Button>
        </Form>
      ) : (
        !props.showEditAnswerForm && (
          <Button
            variant="primary"
            onClick={() => {
              props.setShowAddAnswerForm(true);
              props.setShowEditAnswerForm(false);
              setDate(dayjs().format("YYYY-MM-DD")); // setto la data al giorno corrente con dayjs()
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
  const [date, setDate] = useState(props.obj.date);
  const [text, setText] = useState(props.obj.text);
  const [author, setAuthor] = useState(props.obj.author);
  const [score, setScore] = useState(props.obj.score);
  const [errorMsg, setErrorMsg] = useState("");
  const [timeOutID, setTimeOutID] = useState(null);

  useEffect(() => {
    // siccome il componente <EditAnswerForm /> viene renderizzato prima che la props.obj sia stata definita (perchè viene definita con dei valoridopo che premo il pulsate di modifica della risposta), utilizzo useEffect per settare i valori ogni volta che la props.obj cambia, altrimenti quando apro il form di modifica i campi sono vuoti.
    setDate(props.obj.date);
    setText(props.obj.text);
    setAuthor(props.obj.author);
    setScore(props.obj.score);
  }, [props.obj]);

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
    if (errorMsg) {
      setErrorMsg("");
      clearTimeout(timeOutID);
    }
    // Form validation
    if (!date || !author || !date || score === "") {
      setErrorMsg("Tutti i campi devono essere compilati.");
      const idTimeOutErrorMsg = setTimeout(() => setErrorMsg(""), 3000);
      setTimeOutID(idTimeOutErrorMsg);
      return;
    }
    const editedAnswer = {
      id: props.obj.id,
      text: text,
      respondent: author,
      date: dayjs(date),
      score: parseInt(score),
    };
    props.editAnswer(editedAnswer);
    props.setShowEditAnswerForm(false);
  };

  return (
    <>
      {errorMsg ? (
        <Alert
          className="text-center"
          variant="danger"
          onClose={() => {
            setErrorMsg("");
            clearTimeout(timeOutID);
          }}
          dismissible
        >
          {errorMsg}
        </Alert>
      ) : null}

      {props.showEditAnswerForm && (
        <Form onSubmit={handleSubmitEditAnswer}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={handleDate}
              disabled
            />
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
            onClick={() => {
              props.setShowEditAnswerForm(false);
              setErrorMsg("");
              clearTimeout(timeOutID);
            }}
          >
            Close
          </Button>
        </Form>
      )}
    </>
  );
}

export { AddAnswerForm, EditAnswerForm };
