/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Form, Button, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import dayjs from "dayjs";
import AuthContext from "./context/AuthContext";

function QuestionForm(props) {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD")); // setto la data al giorno corrente con dayjs()
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timeOutID, setTimeOutID] = useState(null);

  const { isLoggedIn } = useContext(AuthContext);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (errorMsg) {
      setErrorMsg("");
      clearTimeout(timeOutID);
    }

    // Form validation
    if (!text || !author || !date) {
      setErrorMsg("Tutti i campi devono essere compilati.");
      const idTimeoutErrorMsg = setTimeout(() => setErrorMsg(""), 3000);
      setTimeOutID(idTimeoutErrorMsg);
      return;
    }
    const newQuestion = {
      text: text,
      email: author,
      date: dayjs(),
    };
    props.addQuestion(newQuestion);
    clearForm();
  };

  const clearForm = () => {
    // setDate("");
    setText("");
    setAuthor("");
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

      {isLoggedIn ? (
        <Form onSubmit={handleSubmit}>
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
          {props.mode === "add" && (
            <Button variant="primary" type="submit">
              Add
            </Button>
          )}
          {props.mode === "edit" && (
            <Button variant="primary" type="submit">
              Edit
            </Button>
          )}
          <Button
            variant="secondary"
            className="mx-1"
            onClick={() => {
              props.close();
              setErrorMsg("");
              clearTimeout(timeOutID);
              clearForm();
            }}
          >
            Close
          </Button>
        </Form>
      ) : null}
    </>
  );
}

export { QuestionForm };
