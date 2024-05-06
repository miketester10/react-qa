/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import API from "../API";
import AuthContext from "./context/AuthContext";

const LoginForm = (props) => {
  const [email, setEmail] = useState("mike@polito.com");
  const [password, setPassword] = useState("pwd");
  const [errorMsg, setErrorMsg] = useState("");
  const [timeOutID, setTimeOutID] = useState(null);

  const navigate = useNavigate();

  const { setUser, setIsLoggedIn, setNavbarLoginState } =
    useContext(AuthContext);

  const location = useLocation();
  useEffect(() => {
    setNavbarLoginState(false);
  }, [location]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (errorMsg) {
      setErrorMsg("");
      clearTimeout(timeOutID);
    }
    // Form validation
    if (!email || !password) {
      setErrorMsg("Tutti i campi devono essere compilati.");
      const idTimeoutErrorMsg = setTimeout(() => setErrorMsg(""), 3000);
      setTimeOutID(idTimeoutErrorMsg);
      return;
    }
    const credentials = { username: email, password: password };
    doLogin(credentials);
  };

  const doLogin = (credentials) => {
    if (props.successMsg) {
      props.setSuccessMsg("");
      clearTimeout(props.successMsgTimeOutID);
    }
    API.login(credentials)
      .then((user) => {
        setUser(user);
        setIsLoggedIn(true);
        navigate("/");
        props.setSuccessMsg({
          message_questionsComponent: "Login effettuato!",
          variant: "added",
        });
        const id = setTimeout(() => props.setSuccessMsg(""), 4000);
        props.setSuccessMsgTimeOutID(id);
      })
      .catch((error) => setErrorMsg("Email o password errata."));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                <i className="bi bi-newspaper"></i> HeapOverrun
              </h5>

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
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    Accedi
                  </button>
                </div>
                <hr className="my-4" />
                <div className="d-grid">
                  <button
                    className="btn btn-success btn-login fw-bold"
                    onClick={() => navigate("/register")}
                  >
                    Registrati
                  </button>
                  <Link
                    className="mt-2"
                    to="/"
                    style={{ textDecoration: "none" }}
                  >
                    Torna alla Homepage
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
