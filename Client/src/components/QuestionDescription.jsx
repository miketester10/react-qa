/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";
import { useContext, useEffect } from "react";
import AuthContext from "./context/AuthContext";

function QuestionDescription(props) {
  const { setNavbarLoginState } = useContext(AuthContext);

  useEffect(() => {
    setNavbarLoginState(true);
  }, []);

  return (
    <Row>
      <Col md={6} as="p" style={{ fontStyle: "sans-serif", fontSize: "16px" }}>
        <strong>Question: </strong>
        <span style={{ fontSize: "20px" }}>{props.question.text}</span>
      </Col>
      <Col md={6} as="p" className="text-end" style={{ fontSize: "16px" }}>
        Asked By:
        <span className="badge rounded-pill bg-secondary ms-2">
          {props.question.email}
        </span>
      </Col>
    </Row>
  );
}

export default QuestionDescription;
