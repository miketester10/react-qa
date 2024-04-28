/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

function QuestionDescription(props) {
  return (
    <>
      <Row>
        <Col md={6} as="p" style={{ fontSize: "18px" }}>
          <strong>Question #{props.question.id}: </strong>
        </Col>
        <Col md={6} as="p" className="text-end" style={{ fontSize: "18px" }}>
          Asked By:
          <span className="badge rounded-pill bg-secondary ms-2">
            {props.question.email}
          </span>
        </Col>
      </Row>
      <Row>
        <Col as="p" className="mb-0" style={{ fontSize: "18px" }}>
          {props.question.text}
        </Col>
      </Row>
    </>
  );
}

export default QuestionDescription;
