const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator"); // validation middleware
const dao = require("./db/dao");

/*** Inizializzo Express ***/
const app = express();
const PORT = 8080;

/*** Set-up Middleware ***/
app.use(cors()); // Abilita CORS per tutte le API
app.use(express.json());

app.get(
  "/api/v1/questions/:id/answers/",
  [check("id").isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const question_id = req.params.id;
      const answers = await dao.listAnswersByQuestion(question_id);
      res.json({ answers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/*** Avvio del server ***/
app.listen(PORT, () => {
  console.log(`Il server è in ascolto sulla porta ${PORT}`);
});
