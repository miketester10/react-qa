/* eslint-disable react/prop-types */
import { Col, Row } from "react-bootstrap";

const QuestionsTitle = (props) => {
  return (
    <Row>
      <Col
        md={12}
        className="text-center"
        as="p"
        style={{ fontStyle: "sans-serif", fontSize: "20px" }}
      >
        <strong>Questions {`(${props.questions.length})`}</strong>
      </Col>
    </Row>
  );
};

export default QuestionsTitle;
