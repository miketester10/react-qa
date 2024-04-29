const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database("./db/react-qa.db", (err) => {
  if (err) throw err;
});

function getQuestion(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questions WHERE id = ?";

    db.get(sql, [id], (err, row) => {
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
}

function listAnswersByQuestion(question_id) {
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
}

function voteAnswer(id, vote) {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE answers SET score = score + ? WHERE id = ?";
    const delta = vote === "up" ? 1 : -1;
    db.run(sql, [delta, id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}

exports.listAnswersByQuestion = listAnswersByQuestion;
exports.getQuestion = getQuestion;
exports.voteAnswer = voteAnswer;
