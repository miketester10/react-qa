const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database("./db/react-qa.db", (err) => {
  if (err) throw err;
});

// get the question identified by {id}
exports.getQuestion = (question_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questions WHERE id = ?";

    db.get(sql, [question_id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: "Question non trovata nel database." });
      } else {
        const question = {
          id: row.id,
          text: row.text,
          email: row.email,
          date: dayjs(row.date),
        };

        resolve(question);
      }
    });
  });
};

// get all answers to a given question
exports.listAnswersByQuestion = (question_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM answers WHERE question_id = ? 
                ORDER BY score DESC, date DESC`;

    db.all(sql, [question_id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const answers = rows.map((e) => ({
        id: e.id,
        text: e.text,
        respondent: e.respondent,
        score: parseInt(e.score),
        date: dayjs(e.date),
        question_id: e.question_id,
      }));

      resolve(answers);
    });
  });
};

// add a new answer
exports.createAnswer = (answer) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO answers (text, respondent, date, score, question_id) VALUES (?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        answer.text,
        answer.respondent,
        answer.date,
        answer.score,
        answer.question_id,
      ],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      }
    );
  });
};

// vote an existing answer
exports.voteAnswer = (answer_id, vote) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE answers SET score = score + ? WHERE id = ?";
    const delta = vote === "up" ? 1 : -1;
    db.run(sql, [delta, answer_id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

// delete an existing answer
exports.deleteAnswer = (answer_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM answers WHERE id = ?";
    db.run(sql, [answer_id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};
