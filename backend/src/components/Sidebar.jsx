import { useState, useEffect } from "react";

export default function Sidebar({ loadHistory }) {

  const [sessions, setSessions] = useState([]);

  const token = localStorage.getItem("token");



  const loadSessions = async () => {

    const res = await fetch(
      "http://localhost:5000/api/ai/sessions",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (data.sessions) {
      setSessions(data.sessions);
    }

  };



  const createSession = async () => {

    const res = await fetch(
      "http://localhost:5000/api/ai/session",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (data.session) {

      loadHistory(data.session._id);

      loadSessions();

    }

  };



  const deleteSession = async (id) => {

    await fetch(
      "http://localhost:5000/api/ai/session/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    loadSessions();

  };



  useEffect(() => {
    loadSessions();
  }, []);



  return (

    <div
      style={{
        width: "260px",
        background: "#111",
        color: "white",
        padding: "20px",
        height: "100vh"
      }}
    >

      <h2>AI SaaS</h2>

      <button
        onClick={createSession}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          background: "#4CAF50",
          border: "none",
          color: "white",
          cursor: "pointer"
        }}
      >
        + New Chat
      </button>


      {sessions.map((s) => (

        <div
          key={s._id}
          style={{
            padding: "10px",
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <span
            style={{ cursor: "pointer" }}
            onClick={() => loadHistory(s._id)}
          >
            {s.title || "New Chat"}
          </span>

          <button
            style={{
              background: "transparent",
              border: "none",
              color: "red",
              cursor: "pointer"
            }}
            onClick={() => deleteSession(s._id)}
          >
            🗑
          </button>

        </div>

      ))}

    </div>

  );

}