const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator"); // validation middleware
const isLoggedIn = require("../middleware/isLoggedIn");
const dao = require("../db/dao");
const dayjs = require("dayjs");

/*** APIs ***/

// API per aggiungere una nuova risposta ad una domanda
router.post(
  "/api/answers",
  isLoggedIn,
  [
    check("date").isISO8601(),
    check("text").isLength({ min: 2 }),
    check("respondent").isLength({ min: 2 }),
    check("score").isInt(),
    check("question_id").isInt(),
  ],
  async (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      error = { message: JSON.stringify(error.array()) };
      return res.status(422).json({ error: error.message });
    }
    try {
      const answer = req.body;
      const result = await dao.createAnswer(answer, req.user.id);
      setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// API per modificare una risposta
router.put(
  "/api/answers/:id",
  isLoggedIn,
  [
    check("date").isISO8601(),
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
      const result = await dao.editAnswer(answer, req.user.id);
      setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// API per aggiungere score ad una risposta
router.post(
  "/api/answers/:id/vote",
  [check("id").isInt()],
  async (req, res) => {
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
  }
);

// API per eliminare una risposta
router.delete("/api/answers/:id", isLoggedIn, async (req, res) => {
  try {
    const answer_id = req.params.id;
    const result = await dao.deleteAnswer(answer_id, req.user.id);
    setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
