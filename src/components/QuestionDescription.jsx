/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

function QuestionDescription(props) {
  return (
    <>
      <Row>
        <Col md={6} as="p">
          <strong>Question #{props.question.id}: </strong>
        </Col>
        <Col md={6} as="p" className="text-end">
          Asked By:
          <span className="badge rounded-pill bg-secondary ms-2">
            {props.question.email}
          </span>
        </Col>
      </Row>
      <Row>
        <Col as="lead">{props.question.text}</Col>
      </Row>
    </>
  );
}

export default QuestionDescription;
