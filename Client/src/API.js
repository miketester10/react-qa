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
      user_id: e.user_id,
    }));
  } else {
    throw answers.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function addAnswer(answer) {
  // call  /api/answers
  const response = await fetch(URL + `/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...answer, date: answer.date.format("YYYY-MM-DD") }),
    credentials: "include",
  });
  if (!response.ok) {
    const errore = await response.json();
    throw errore.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function editAnswer(answer) {
  // call  /api/answers/:id
  const response = await fetch(URL + `/answers/${answer.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...answer, date: answer.date.format("YYYY-MM-DD") }),
    credentials: "include",
  });
  if (!response.ok) {
    const errore = await response.json();
    throw errore.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
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

async function deleteAnswer(id) {
  // call  /api/answers/:id
  const response = await fetch(URL + `/answers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const errore = await response.json();
    throw errore.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function login(credentials) {
  // call  /api/login
  const response = await fetch(URL + `/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function logout() {
  // call  /api/logout
  const response = await fetch(URL + `/logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const errore = await response.json();
    throw errore.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getCurrentUser() {
  // call  /api/session/current
  const response = await fetch(URL + `/session/current`, {
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user.error; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

const API = {
  getQuestionById,
  getAnswersByQuestionId,
  addAnswer,
  editAnswer,
  voteAnswer,
  deleteAnswer,
  login,
  logout,
  getCurrentUser,
};
export default API;
