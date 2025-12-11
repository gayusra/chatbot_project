// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import chatbotAnimation from "./assets/chatbot_ai.json";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]); // {id, sender: 'user'|'ai', text, time}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const addMessage = (m) => setMessages(prev => [...prev, { ...m, id: Date.now().toString() }]);

  const sendToBackend = async (text) => {
    setLoading(true);
    try {
      // Call your backend (relative URL works in dev if proxy is set or if server runs on same host)
      const resp = await axios.post("/api/generate", {
        contents: [{ parts: [{ text }] }]
      });
      // adapt to the shape your backend returns; here we expect resp.data.result ...
      const aiText = resp?.data?.result?.candidates?.[0]?.content?.parts?.[0]?.text
        || resp?.data?.result?.response
        || "No valid reply from AI";
      addMessage({ sender: "ai", text: aiText, time: new Date().toLocaleTimeString() });
    } catch (err) {
      console.error(err);
      addMessage({ sender: "ai", text: "Error: cannot reach AI. See console.", time: new Date().toLocaleTimeString() });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    const t = input.trim();
    if (!t || loading) return;
    addMessage({ sender: "user", text: t, time: new Date().toLocaleTimeString() });
    setInput("");
    sendToBackend(t);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-card">
        <div className="chat-header">
          <div className="title">Chat with AI</div>
          <Lottie animationData={chatbotAnimation} style={{ width: 100 }} />
        </div>

        <div className="chat-window" ref={scrollRef}>
          {messages.length === 0 && <div className="empty">Say hi 👋</div>}
          {messages.map(m => (
            <div key={m.id} className={`bubble-row ${m.sender === "user" ? "right" : "left"}`}>
              {m.sender === "ai" && <div className="avatar">AI</div>}
              <div className={`bubble ${m.sender === "user" ? "bubble-user" : "bubble-ai"}`}>
                <div className="bubble-text">{m.text}</div>
                <div className="bubble-meta">{m.time}</div>
              </div>
              {m.sender === "user" && <div className="avatar user">You</div>}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <textarea
            rows={1}
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
