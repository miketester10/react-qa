const express = require("express");
const router = express.Router();
const dao = require("../db/dao");
const { check, validationResult } = require("express-validator"); // validation middleware
const isLoggedIn = require("../middleware/isLoggedIn");
const dayjs = require("dayjs");

/*** APIs ***/

// API per ottenere tutte le domande
router.get("/api/questions", async (req, res) => {
  try {
    const questions = await dao.getQuestions();
    setTimeout(() => res.json(questions), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API per ottenere una domanda
router.get("/api/questions/:id", async (req, res) => {
  try {
    const question_id = req.params.id;
    const question = await dao.getQuestionById(question_id);
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
router.get("/api/questions/:id/answers/", async (req, res) => {
  try {
    const question_id = req.params.id;
    const question = await dao.getQuestionById(question_id);
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

// API per aggiungere una nuova domanda
router.post(
  "/api/questions",
  isLoggedIn,
  [
    check("date").isISO8601(),
    check("text").isLength({ min: 2 }),
    check("email").isEmail(),
  ],
  async (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      error = { message: JSON.stringify(error.array()) };
      return res.status(422).json({ error: error.message });
    }
    try {
      const question = req.body;
      const result = await dao.createQuestion(question, req.user.id);
      setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// API per eliminare una domanda
router.delete("/api/questions/:id", isLoggedIn, async (req, res) => {
  try {
    const question_id = req.params.id;
    const result = await dao.deleteQuestion(question_id, req.user.id);
    setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
