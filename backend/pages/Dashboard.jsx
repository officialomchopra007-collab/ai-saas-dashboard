import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";

export default function Dashboard() {

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [credits, setCredits] = useState(0);

  const chatEndRef = useRef(null);

  const token = localStorage.getItem("token");



  /* ==========================
     AUTO SCROLL CHAT
  ========================== */

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  /* ==========================
     LOAD USER CREDITS
  ========================== */

  const loadCredits = async () => {

    const res = await fetch(
      "http://localhost:5000/api/user/usage",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (data.usage) {
      setCredits(data.usage.credits);
    }

  };



  /* ==========================
     LOAD CHAT HISTORY
  ========================== */

  const loadHistory = async (id) => {

    setSessionId(id);

    const res = await fetch(
      "http://localhost:5000/api/ai/history/" + id,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (data.success) {

      const formatted = data.chats.map(msg => ({
        role: msg.role === "assistant" ? "ai" : "user",
        text: msg.content
      }));

      setMessages(formatted);

    }

  };



  /* ==========================
     STREAM TEXT EFFECT
  ========================== */

  const streamText = (text) => {

    let index = 0;

    const interval = setInterval(() => {

      setMessages(prev => {

        const last = prev[prev.length - 1];

        const updated = [
          ...prev.slice(0, -1),
          {
            ...last,
            text: text.slice(0, index)
          }
        ];

        return updated;

      });

      index++;

      if (index > text.length) {
        clearInterval(interval);
      }

    }, 10);

  };



  /* ==========================
     SEND MESSAGE
  ========================== */

  const sendMessage = async () => {

    if (!sessionId) {
      alert("Create a chat first");
      return;
    }

    const newMessages = [
      ...messages,
      { role: "user", text: message }
    ];

    setMessages(newMessages);

    setMessage("");

    setMessages([
      ...newMessages,
      { role: "ai", text: "AI is typing..." }
    ]);



    const res = await fetch(
      "http://localhost:5000/api/ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          message,
          sessionId
        })
      }
    );

    const data = await res.json();

    let aiReply = "";

    if (data.reply) {
      aiReply = data.reply;
    } else if (data.message) {
      aiReply = data.message;
    }



    setMessages([
      ...newMessages,
      { role: "ai", text: "" }
    ]);

    streamText(aiReply);

    loadCredits();

  };



  useEffect(() => {
    loadCredits();
  }, []);



  return (

    <div style={{ display: "flex" }}>

      <Sidebar loadHistory={loadHistory} />

      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#1a1a1a",
          color: "white",
          height: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >

          <h1>AI SaaS Dashboard 🚀</h1>

          <div
            style={{
              background: "#333",
              padding: "8px 15px",
              borderRadius: "6px"
            }}
          >
            Credits: {credits}
          </div>

        </div>



        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "10px"
          }}
        >

          {messages.map((m, i) => (
            <ChatMessage
              key={i}
              role={m.role}
              text={m.text}
            />
          ))}

          <div ref={chatEndRef} />

        </div>



        <div style={{ marginTop: "15px" }}>

          <textarea
            rows="3"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px"
            }}
            placeholder="Ask something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }

            }}
          />

          <br />

          <button
            onClick={sendMessage}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#4CAF50",
              border: "none",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

}