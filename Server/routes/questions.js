const express = require("express");
const router = express.Router();
const dao = require("../db/dao");

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

module.exports = router;
