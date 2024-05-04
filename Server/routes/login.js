const express = require("express");
const passport = require("passport");
const router = express.Router();
const { check, validationResult } = require("express-validator"); // validation middleware

/*** API Login ***/

// Validazione dati login
const validateLoginInput = [
  check("username").isEmail(),
  check("password").notEmpty(),
];

router.post(
  "/api/login",
  validateLoginInput,
  (req, res, next) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      error = { message: JSON.stringify(error.array()) };
      return res.status(422).json({ error: error.message });
    }
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    console.log(req.body);
    res.json(req.user);
  }
);

module.exports = router;
