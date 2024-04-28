const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database("./db/react-qa.db", (err) => {
  if (err) throw err;
});

function listAnswersByQuestion(question_id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM answers WHERE question_id = ?";

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

exports.listAnswersByQuestion = listAnswersByQuestion;
