const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

/*** API Logout ***/

// check whether the user is logged in or not
router.get("/api/session/current", isLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;