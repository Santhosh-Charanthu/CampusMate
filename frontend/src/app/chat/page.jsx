"use client";
import { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const roomId = "room123";
  const userId = "userA"; // later this comes from auth

  useEffect(() => {
    // 1️⃣ Load old messages
    fetch(`http://localhost:5000/api/messages/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });

    // 2️⃣ Connect socket
    socket.connect();
    socket.emit("join_room", roomId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", {
      roomId,
      text: message,
      senderId: userId,
    });

    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Room</h2>

      <div
        style={{ border: "1px solid #ccc", minHeight: 200, marginBottom: 10 }}
      >
        {messages.map((msg) => (
          <p key={msg._id}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
