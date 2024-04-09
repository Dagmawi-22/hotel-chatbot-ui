import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file for styling

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatInputRef = useRef(null);

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/chatbot/",
        {
          query: query,
        }
      );
      console.log("Response:", response.data);
      const newMessage = response.data.data;
      console.log("New message:", newMessage.response);
      setChatHistory([
        ...chatHistory,
        { text: query, isUser: true },
        { text: newMessage.response, isUser: false },
      ]);
      setQuery("");
      chatInputRef.current.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    if (isOpen) {
      chatInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="chat-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-history">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`message-container ${
                  msg.isUser ? "user-message" : "bot-message"
                }`}
              >
                <div className="message">{msg.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="chat-input-container">
            <input
              type="text"
              ref={chatInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      )}
      <button
        className={`chat-button ${isOpen ? "hidden" : ""}`}
        onClick={toggleChatWindow}
      >
        Open Chat
      </button>
    </div>
  );
}

export default App;
