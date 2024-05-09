const express = require("express");
const cors = require("cors");
const {
  configureSession,
  initializePassport,
} = require("./config/passport_auth");
const session_current_router = require("./routes/session_current");
const login_router = require("./routes/login");
const logout_router = require("./routes/logout");
const questions_router = require("./routes/questions");
const answers_router = require("./routes/answers");
require("dotenv").config();

/*** Inizializzo Express ***/
const app = express();
const PORT = process.env.PORT || 3000;

/*** Set-up Cors e express.json ***/
const cors_options = {
  //  Questa opzione assicura che il server consenta le richieste provenienti dall'origine specificata e includa i cookie nelle richieste CORS.
  origin: "http://localhost:5173", // NB: In produzione indicare dominio e porta corretti.
  credentials: true,
};
app.use(cors(cors_options));
app.use(express.json());

/*** Passo app come parametro alle funzioni di Passport in passport_auth.js ***/
configureSession(app);
initializePassport(app);

/*** Set-up Router ***/
app.use(session_current_router);
app.use(login_router);
app.use(questions_router);
app.use(answers_router);
app.use(logout_router);

/*** Avvio del server ***/
app.listen(PORT, () => {
  console.log(`Il server è in ascolto sulla porta ${PORT}`);
});
