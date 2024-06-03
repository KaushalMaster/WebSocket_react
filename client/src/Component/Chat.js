import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./chatStyle.css";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("notification", (notification) => {
      console.log(notification);
      setNotification(notification);
      setTimeout(() => setNotification(""), 5000); // Clear notification after 5 seconds
    });

    return () => {
      socket.off("chat message");
      socket.off("notification");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <div>
      <header className="App-header">
        <h1>Chat App</h1>
        {/* Adding the real-time notifications */}
        {notification && <div className="notification">{notification}</div>}
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              {msg}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </header>
    </div>
  );
};

export default Chat;
