/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Container, Navbar } from "react-bootstrap";

function NavHeader(props) {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container fluid>
        {/* <Navbar.Brand>HeapOverrun - Question {props.question.id}</Navbar.Brand> */}
        <Navbar.Brand>
          <i className="bi bi-newspaper"></i> HeapOverrun
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
