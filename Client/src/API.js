/**
 * All the API calls
 */

import dayjs from "dayjs";

const URL = "http://localhost:8080/api";

async function getQuestionById(id) {
  // call  /api/questions/<id>
  const response = await fetch(URL + `/questions/${id}`);
  const question = await response.json();
  if (response.ok) {
    return {
      id: question.id,
      text: question.text,
      email: question.email,
      date: dayjs(question.date),
    };
  } else {
    throw question.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getAnswersByQuestionId(id) {
  // call  /api/questions/<id>/answers
  const response = await fetch(URL + `/questions/${id}/answers`);
  const answers = await response.json();
  if (response.ok) {
    return answers.map((e) => ({
      id: e.id,
      text: e.text,
      respondent: e.respondent,
      score: e.score,
      date: dayjs(e.date),
      question_id: e.question_id,
    }));
  } else {
    throw answers.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function voteAnswer(id) {
  // call  /api/answers/:id/vote
  const response = await fetch(URL + `/answers/${id}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vote: "up" }),
  });
  if (!response.ok) {
    const errore = await response.json();
    throw errore.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

const API = { getQuestionById, getAnswersByQuestionId, voteAnswer };
export default API;
