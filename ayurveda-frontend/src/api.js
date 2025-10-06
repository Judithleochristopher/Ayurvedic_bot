import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function fetchHerbs(skip = 0, limit = 10) {
  const res = await axios.get(`${API_URL}/herbs?skip=${skip}&limit=${limit}`);
  return res.data;
}

// Expects an object with { user_input: string }
export async function getAyurvedicSuggestions(payload) {
  const res = await axios.post(`${API_URL}/query`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

// Get the first quiz question and details
export async function getQuizStart() {
  const res = await axios.get(`${API_URL}/quiz/start`);
  return res.data;
}

// Post an answer for a quiz question, get correctness, explanation, and next question if any
export async function postQuizAnswer(payload) {
  const res = await axios.post(`${API_URL}/quiz/answer`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
