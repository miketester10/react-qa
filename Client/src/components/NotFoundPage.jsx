/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { motion } from "framer-motion";

const NotFoundPage = (props) => {
  const { setNavbarLoginState } = useContext(AuthContext);

  const location = useLocation();
  useEffect(() => {
    setNavbarLoginState(true);
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: "center", marginTop: "50px" }}
    >
      <h1>Oops! Pagina non trovata.</h1>
      <p>
        La pagina che stai cercando potrebbe essere stata rimossa o non essere
        disponibile al momento.
      </p>
      <Link to="/">Torna alla Homepage</Link>
    </motion.div>
  );
};

export default NotFoundPage;
