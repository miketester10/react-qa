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

/*** APIs ***/

// API per ottenere una domanda
app.get("/api/questions/:id", async (req, res) => {
  try {
    const question_id = req.params.id;
    const question = await dao.getQuestion(question_id);
    if (question.error) {
      res.status(404).json({ error: question.error });
    } else {
      res.json(question);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API per ottenere le risposte di una domanda
app.get("/api/questions/:id/answers/", async (req, res) => {
  try {
    const question_id = req.params.id;
    const question = await dao.getQuestion(question_id);
    if (question.error) {
      res.status(404).json({ error: question.error });
    } else {
      const answers = await dao.listAnswersByQuestion(question_id);
      setTimeout(() => res.json(answers), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API per aggiungere una risposta ad una domanda
app.post(
  "/api/answers",
  [
    check("date").isDate({ format: "YYYY-MM-DD", strictMode: true }),
    check("text").isLength({ min: 2 }),
    check("respondent").isLength({ min: 2 }),
    check("score").isInt(),
  ],
  async (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      error = { message: JSON.stringify(error.array()) };
      return res.status(422).json({ error: error.message });
    }
    try {
      const answer = req.body;
      const result = await dao.createAnswer(answer);
      setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// API per modificare una risposta
app.put(
  "/api/answers/:id",
  [
    check("date").isDate({ format: "YYYY-MM-DD", strictMode: true }),
    check("text").isLength({ min: 2 }),
    check("respondent").isLength({ min: 2 }),
    check("score").isInt(),
  ],
  async (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      error = { message: JSON.stringify(error.array()) };
      return res.status(422).json({ error: error.message });
    }
    try {
      const answer = req.body;
      const result = await dao.editAnswer(answer);
      setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// API per aggiungere score ad una risposta
app.post("/api/answers/:id/vote", [check("id").isInt()], async (req, res) => {
  let error = validationResult(req);
  if (!error.isEmpty()) {
    error = { message: JSON.stringify(error.array()) };
    return res.status(422).json({ error: error.message });
  }
  try {
    const answer_id = req.params.id;
    const vote = req.body.vote;
    const result = await dao.voteAnswer(answer_id, vote);
    setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API per eliminare una risposta
app.delete("/api/answers/:id", async (req, res) => {
  try {
    const answer_id = req.params.id;
    const result = await dao.deleteAnswer(answer_id);
    setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*** Avvio del server ***/
app.listen(PORT, () => {
  console.log(`Il server è in ascolto sulla porta ${PORT}`);
});
