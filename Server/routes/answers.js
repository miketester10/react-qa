const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator"); // validation middleware
const dao = require("../db/dao");

/*** APIs ***/

// API per aggiungere una nuova risposta ad una domanda
router.post(
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
router.put(
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
router.post("/api/answers/:id/vote", [check("id").isInt()], async (req, res) => {
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
router.delete("/api/answers/:id", async (req, res) => {
  try {
    const answer_id = req.params.id;
    const result = await dao.deleteAnswer(answer_id);
    setTimeout(() => res.json({ success: result }), 1000); // il setTimeout l'ho messo solo per simulare il tempo di risposta (va tolto in produzione)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
