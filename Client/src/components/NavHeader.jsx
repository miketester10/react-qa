/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import API from "../API";
import AuthContext from "./context/AuthContext";

function NavHeader(props) {
  const { user, isLoggedIn, setUser, setIsLoggedIn, navbarLoginState } =
    useContext(AuthContext);

  const doLogout = () => {
    if (props.successMsg) {
      props.setSuccessMsg("");
      clearTimeout(props.successMsgTimeOutID);
    }
    API.logout()
      .then(() => {
        setUser("");
        setIsLoggedIn(false);
        props.setSuccessMsg({
          message_questionsComponent: "Logout effettuato!",
          variant: "added",
        });
        const id = setTimeout(() => props.setSuccessMsg(""), 4000);
        props.setSuccessMsgTimeOutID(id);
      })
      .catch((error) => {
        props.setErrorMsg({
          message: "Si è verificato un errore. Riprova...",
          variant: "deleted",
        });
        setTimeout(() => props.setErrorMsg(""), 4000);
      });
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand>
          <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
            <i className="bi bi-newspaper"></i> HeapOverrun
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        {navbarLoginState && (
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <>
                <Navbar.Brand className="fs-6" style={{ marginRight: "0px" }}>
                  Signed in as: {user.nome}
                </Navbar.Brand>
                <Link
                  className="mx-2"
                  to="/"
                  onClick={doLogout}
                  style={{ textDecoration: "none" }}
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                className="mx-2"
                to="/login"
                style={{ textDecoration: "none" }}
              >
                Login
              </Link>
            )}
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
}

export default NavHeader;
