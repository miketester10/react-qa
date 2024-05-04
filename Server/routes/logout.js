const express = require("express");
const router = express.Router();

/*** API Logout ***/

router.delete("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Errore durante il logout" });
    } else {
      console.log("Logout effettuato con successo!");
      req.session.destroy((err) => (err ? console.error(err) : res.end())); // Elimina la sessione corrente dalla cartella sessions
    }
  });
});

module.exports = router;
