/* eslint-disable no-unused-vars */
import { Col, Row, Table } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "./context/AuthContext";

const QuestionsList = (props) => {
  const { setNavbarLoginState } = useContext(AuthContext);

  const location = useLocation();
  useEffect(() => {
    setNavbarLoginState(true);
  }, [location]);

  return (
    <div>
      <Row>
        <Col as="p">
          <span style={{ fontStyle: "sans-serif", fontSize: "16px" }}>
            <strong>Questions {/***`(${props.questions.length})`***/}: </strong>
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={10} className="mx-auto">
          <Table striped bordered>
            <thead>
              <tr>
                <th>Date</th>
                <th>Text</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionsList;
