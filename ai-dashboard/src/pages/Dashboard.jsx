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



  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



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

    let aiReply = data.reply || data.message;

    setMessages([
      ...newMessages,
      { role: "ai", text: aiReply }
    ]);

    loadCredits();

  };



  useEffect(() => {
    loadCredits();
  }, []);



  return (

    <div className="flex">

      <Sidebar loadHistory={loadHistory} />

      <div className="flex-1 p-8 text-white">

        <div className="flex justify-between mb-6">

          <h1 className="text-2xl font-bold">
            AI Dashboard
          </h1>

          <div className="bg-slate-700 px-4 py-1 rounded">
            Credits: {credits}
          </div>

        </div>



        <div className="h-[70vh] overflow-y-auto mb-4">

          {messages.map((m, i) => (
            <ChatMessage
              key={i}
              role={m.role}
              text={m.text}
            />
          ))}

          <div ref={chatEndRef} />

        </div>



        <textarea
          className="w-full p-3 rounded bg-slate-800"
          rows="3"
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

        <button
          onClick={sendMessage}
          className="mt-3 bg-green-500 px-6 py-2 rounded"
        >
          Send
        </button>

      </div>

    </div>

  );

}