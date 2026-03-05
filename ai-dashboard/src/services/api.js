const API_BASE = "http://localhost:5000/api";

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

export const getUsage = async (token) => {
  const res = await fetch(`${API_BASE}/user/usage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

export const createSession = async (token) => {
  const res = await fetch(`${API_BASE}/ai/session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

export const sendMessage = async (token, message, sessionId) => {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      message,
      sessionId
    })
  });

  return res.json();
};