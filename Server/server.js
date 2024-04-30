const express = require("express");
const cors = require("cors");
// const { check, validationResult } = require("express-validator"); // validation middleware
// const dao = require("./db/dao");
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');

/*** Inizializzo Express ***/
const app = express();
const PORT = 8080;

/*** Set-up Middleware ***/
app.use(cors()); // Abilita CORS per tutte le API
app.use(express.json());

/*** Set-up Router */
app.use(questionsRouter);
app.use(answersRouter);

/*** Avvio del server ***/
app.listen(PORT, () => {
  console.log(`Il server è in ascolto sulla porta ${PORT}`);
});