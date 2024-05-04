const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");

const db = new sqlite.Database("./db/react-qa.db", (err) => {
  if (err) throw err;
});

exports.getUserFromDBbyEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        // errore durante la query
        reject(err);
      } else if (row === undefined) {
        // user non trovato (ovvero email non trovata nel db)
        resolve(false);
      } else {
        // user trovato (ovvero email trovata nel db)
        const user = { id: row.id, username: row.email, nome: row.nome }; // questo verrà inviato al Client

        bcrypt.compare(password, row.password).then((result) => {
          if (result) {
            // password corretta
            resolve(user);
          } else {
            // password errata
            resolve(false);
          }
        });
      }
    });
  });
};

exports.getUserFromDBbyID = (id) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
          if (err) {
              reject(err);
          } else {
              const user = { id: row.id, username: row.email, nome: row.nome, cognome: row.cognome }; // questo viene messo a disposizione nelle routes del Server in req.user
              resolve(user);
          }
      });
  });
};