"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../lib/authFetch";
import socket from "../lib/socket";

export default function InboxPage() {
  const [chats, setChats] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const router = useRouter();

  // 1️⃣ Fetch Initial Data on Mount
  useEffect(() => {
    authFetch("http://localhost:5000/api/chatrooms/my")
      .then((res) => res.json())
      .then(setChats)
      .catch(console.error);
  }, []);

  // 2️⃣ Setup Socket and Unified Event Listeners
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.auth = { token };
    socket.connect();

    const notificationSound = new Audio("/sounds/notification.wav");

    const handleMessage = (msg) => {
      // Play sound
      notificationSound.play().catch(() => {});

      setChats((prev) => {
        const chatIndex = prev.findIndex((c) => c.roomId === msg.roomId);
        if (chatIndex === -1) return prev;

        // Create updated chat object
        const updatedChat = {
          ...prev[chatIndex],
          lastMessage: msg,
          unreadCount: (prev[chatIndex].unreadCount || 0) + 1,
        };

        // Remove old entry and move new one to the TOP
        const otherChats = prev.filter((c) => c.roomId !== msg.roomId);
        return [updatedChat, ...otherChats];
      });
    };

    const handleTyping = ({ roomId, isTyping }) => {
      setTypingStatus((prev) => ({ ...prev, [roomId]: isTyping }));
    };

    socket.on("receive_message", handleMessage);
    socket.on("user_typing", handleTyping);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("user_typing", handleTyping);
    };
  }, []);

  const handleChatClick = async (roomId) => {
    try {
      // Optimistic UI update
      setChats((prev) =>
        prev.map((c) => (c.roomId === roomId ? { ...c, unreadCount: 0 } : c))
      );

      await authFetch(`http://localhost:5000/api/chatrooms/${roomId}/read`, {
        method: "POST",
      });

      router.push(`/chat/${roomId}`);
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Chat Inbox</h2>
      {chats.map((chat) => (
        <div
          key={chat.roomId}
          onClick={() => handleChatClick(chat.roomId)}
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <b style={{ display: "block", marginBottom: 4 }}>
              {chat.otherUser?.name}
            </b>
            <p
              style={{
                margin: 0,
                color: typingStatus[chat.roomId] ? "#10b981" : "#666",
                fontSize: 14,
              }}
            >
              {typingStatus[chat.roomId] ? (
                <i>Typing...</i>
              ) : (
                chat.lastMessage?.text || "No messages yet"
              )}
            </p>
          </div>

          {chat.unreadCount > 0 && (
            <span
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "999px",
                fontSize: 12,
                fontWeight: "bold",
                minWidth: 20,
                textAlign: "center",
              }}
            >
              {chat.unreadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
