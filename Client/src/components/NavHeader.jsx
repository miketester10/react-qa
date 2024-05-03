/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { Container, Navbar } from "react-bootstrap";

function NavHeader(props) {
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useContext(AuthContext);

  const doLogout = () => {
    setUser('');
    setIsLoggedIn(false);
  }

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand>
          <i className="bi bi-newspaper"></i> HeapOverrun
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {isLoggedIn ? (
            <>
              <Navbar.Brand className="fs-6" style={{marginRight:'0px'}}>
                Signed in as: {user.nome}
              </Navbar.Brand>
              <Link className="mx-2" onClick={doLogout}>
                Logout
              </Link>
            </>
          ) : (
            <Link className="mx-2" to="/login">
              Login
            </Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
