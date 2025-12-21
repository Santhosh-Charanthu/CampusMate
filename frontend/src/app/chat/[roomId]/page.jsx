"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import socket from "../../lib/socket";
import { authFetch } from "../../lib/authFetch";

export default function ChatPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 1️⃣ Setup Socket Connection & Join Room
  // This hook only runs once per roomId to keep the connection stable
  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.id || payload._id);
    }

    // Connect socket if not already connected
    socket.auth = { token };
    if (!socket.connected) socket.connect();

    // Re-join room if socket reconnects automatically
    const onConnect = () => socket.emit("join_room", roomId);
    socket.on("connect", onConnect);
    if (socket.connected) onConnect();

    // ⚠️ CRITICAL: Cleanup only removes room-specific events
    // Do NOT call socket.disconnect() here so other listeners (Inbox) stay alive
    return () => {
      socket.off("connect", onConnect);
      socket.emit("leave_room", roomId);
    };
  }, [roomId]);

  // 2️⃣ Data Fetching & Real-time Listeners
  // Separated from connection logic to prevent flapping
  useEffect(() => {
    if (!roomId) return;

    // Fetch initial history
    authFetch(`http://localhost:5000/api/messages/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setOtherUser(data.otherUser);
      })
      .catch(console.error);

    // Listeners for this specific room
    socket.on("receive_message", (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    });

    socket.on("message_edited", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    });

    socket.on("message_removed", (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    socket.on("messages_seen_update", ({ roomId: updatedRoomId }) => {
      if (updatedRoomId === roomId) {
        setMessages((prev) =>
          prev.map((m) => ({
            ...m,
            seenBy: Array.from(new Set([...(m.seenBy || []), otherUser?._id])),
          }))
        );
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_edited");
      socket.off("message_removed");
      socket.off("messages_seen_update");
    };
  }, [roomId, otherUser?._id]);

  // 3️⃣ Real-time "Seen" Trigger
  useEffect(() => {
    if (!roomId || !otherUser) return;

    const markMessagesSeen = async () => {
      try {
        await authFetch(`http://localhost:5000/api/messages/${roomId}/seen`, {
          method: "POST",
        });
        socket.emit("mark_seen", { roomId, recipientId: otherUser._id });
      } catch (err) {}
    };
    markMessagesSeen();
  }, [roomId, otherUser, messages.length]);

  // 4️⃣ Actions: Send, Edit, Delete
  const sendMessage = () => {
    if (!text.trim()) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("typing_stop", { roomId, recipientId: otherUser?._id });

    // Emit message to server
    socket.emit("send_message", { roomId, text });
    setText("");
  };

  const handleEdit = async (messageId, oldText) => {
    const newText = prompt("Edit your message:", oldText);
    if (!newText || newText === oldText) return;
    const res = await authFetch(
      `http://localhost:5000/api/messages/${messageId}`,
      {
        method: "PUT",
        body: JSON.stringify({ newText }),
      }
    );
    const updatedMessage = await res.json();
    setMessages((prev) =>
      prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
    );
    socket.emit("message_updated", { roomId, updatedMessage });
  };

  const handleDelete = async (messageId) => {
    if (!confirm("Delete this message?")) return;
    await authFetch(`http://localhost:5000/api/messages/${messageId}`, {
      method: "DELETE",
    });
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
    socket.emit("message_deleted", { roomId, messageId });
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!otherUser?._id) return;
    socket.emit("typing_start", { roomId, recipientId: otherUser._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { roomId, recipientId: otherUser._id });
    }, 2000);
  };

  // 5️⃣ UX: Auto-Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: 10 }}>
        Chat with {otherUser?.name || "..."}
      </h2>

      <div
        style={{
          height: 450,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 10,
          border: "1px solid #efefef",
          borderRadius: 8,
          marginBottom: 15,
        }}
      >
        {messages.map((m) => {
          const isMe = (m.sender?._id || m.sender) === currentUserId;
          const isSeen = isMe && otherUser && m.seenBy?.includes(otherUser._id);
          return (
            <div
              key={m._id}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              <div
                style={{
                  backgroundColor: isMe ? "#2563eb" : "#f3f4f6",
                  color: isMe ? "#fff" : "#000",
                  padding: "10px 14px",
                  borderRadius: 15,
                  borderBottomRightRadius: isMe ? 2 : 15,
                  borderBottomLeftRadius: isMe ? 15 : 2,
                }}
              >
                <b
                  style={{
                    fontSize: 10,
                    display: "block",
                    marginBottom: 2,
                    opacity: 0.7,
                  }}
                >
                  {isMe ? "You" : m.sender?.name || "User"}
                </b>
                <span style={{ wordBreak: "break-all" }}>{m.text}</span>
                {m.isEdited && (
                  <small
                    style={{ display: "block", fontSize: 9, opacity: 0.6 }}
                  >
                    (edited)
                  </small>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {isMe && (
                  <>
                    <span
                      onClick={() => handleEdit(m._id, m.text)}
                      style={{ fontSize: 10, cursor: "pointer", color: "#999" }}
                    >
                      Edit
                    </span>
                    <span
                      onClick={() => handleDelete(m._id)}
                      style={{
                        fontSize: 10,
                        cursor: "pointer",
                        color: "#ff4d4d",
                      }}
                    >
                      Delete
                    </span>
                  </>
                )}
                {isSeen && (
                  <small
                    style={{
                      fontSize: 10,
                      color: "#2563eb",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ Seen
                  </small>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 25,
            border: "1px solid #ddd",
          }}
          value={text}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Write a message..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            borderRadius: 25,
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
