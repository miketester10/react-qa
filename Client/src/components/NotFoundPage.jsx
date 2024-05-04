/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NavHeader from "./NavHeader";

const NotFoundPage = (props) => {
  return (
    <>
    <NavHeader setSuccessMsg={props.setSuccessMsg} setErrorMsg={props.setErrorMsg}/>
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
    </>
  );
};

export default NotFoundPage;
