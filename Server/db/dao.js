const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database("./db/react-qa.db", (err) => {
  if (err) throw err;
});

exports.getQuestions = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM questions
                  ORDER BY date DESC`;
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const questions = rows.map((e) => ({
        id: e.id,
        text: e.text,
        email: e.email,
        date: dayjs(e.date),
        user_id: e.user_id,
      }));
      resolve(questions);
    });
  });
};

// get the question identified by {id}
exports.getQuestionById = (question_id) => {
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
                ORDER BY score DESC`;

    db.all(sql, [question_id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const answers = rows.map((e) => ({
        id: e.id,
        text: e.text,
        respondent: e.username,
        score: parseInt(e.score),
        date: dayjs(e.date),
        question_id: e.question_id,
        user_id: e.user_id,
      }));
      resolve(answers);
    });
  });
};

// add a new answer
exports.createAnswer = (answer, user_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO answers (text, username, date, score, question_id, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [
        answer.text,
        answer.respondent, // sarebbe l'username
        answer.date,
        answer.score,
        answer.question_id,
        user_id,
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

// edit an existing answer
exports.editAnswer = (answer, user_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE answers SET text = ?, username = ?, date = ?, score = ? WHERE id = ? AND user_id = ?";
    db.run(
      sql,
      [
        answer.text,
        answer.respondent, // sarebbe l'username
        answer.date,
        answer.score,
        answer.id,
        user_id,
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
exports.deleteAnswer = (answer_id, user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM answers WHERE id = ? AND user_id = ?";
    db.run(sql, [answer_id, user_id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

// delete an existing question
exports.deleteQuestion = (question_id, user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM questions WHERE id = ? AND user_id = ?";
    db.run(sql, [question_id, user_id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};
