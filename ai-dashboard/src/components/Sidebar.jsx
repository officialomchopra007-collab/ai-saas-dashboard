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

    <div className="w-72 bg-slate-900 text-white h-screen p-5">

      <h1 className="text-xl font-bold mb-6">
        AI SaaS
      </h1>

      <button
        onClick={createSession}
        className="w-full bg-green-500 py-2 rounded mb-5"
      >
        + New Chat
      </button>

      <div className="space-y-2">

        {sessions.map((s) => (

          <div
            key={s._id}
            className="flex justify-between items-center bg-slate-800 p-2 rounded"
          >

            <span
              onClick={() => loadHistory(s._id)}
              className="cursor-pointer text-sm"
            >
              {s.title || "New Chat"}
            </span>

            <button
              onClick={() => deleteSession(s._id)}
              className="text-red-400"
            >
              🗑
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}