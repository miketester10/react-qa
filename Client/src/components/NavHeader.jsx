/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Container, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import API from "../API";
import AuthContext from "./context/AuthContext";

function NavHeader(props) {
  const navigate = useNavigate();

  const { user, isLoggedIn, setUser, setIsLoggedIn, navbarLoginState } =
    useContext(AuthContext);

  const doLogout = () => {
    API.logout()
      .then(() => {
        setUser("");
        setIsLoggedIn(false);
        navigate("/");
        props.setSuccessMsg({
          message: "Logout effettuato!",
          variant: "added",
          state: true,
        });
      })
      .catch((error) => {
        props.setErrorMsg({
          message: "Si è verificato un errore. Riprova...",
          variant: "deleted",
        });
      });
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand>
          <i className="bi bi-newspaper"></i> HeapOverrun
        </Navbar.Brand>
        <Navbar.Toggle />
        {navbarLoginState && (
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <>
                <Navbar.Brand className="fs-6" style={{ marginRight: "0px" }}>
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
        )}
      </Container>
    </Navbar>
  );
}

export default NavHeader;
