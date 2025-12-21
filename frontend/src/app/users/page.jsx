"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../lib/authFetch";
import socket from "../lib/socket"; // 👈 Ensure socket is imported

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  // 1️⃣ Fetch initial user list
  useEffect(() => {
    authFetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  // 2️⃣ Listen for real-time status changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.auth = { token };
    socket.connect();

    const handleStatusChange = ({ userId, isOnline, lastSeen }) => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, isOnline, lastSeen: lastSeen || user.lastSeen }
            : user
        )
      );
    };

    socket.on("user_status_change", handleStatusChange);

    return () => {
      socket.off("user_status_change", handleStatusChange);
    };
  }, []);

  const startChat = async (targetUserId) => {
    const res = await authFetch("http://localhost:5000/api/chatrooms/private", {
      method: "POST",
      body: JSON.stringify({ targetUserId }),
    });

    const room = await res.json();
    router.push(`/chat/${room._id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Connect with Users</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* STATUS DOT */}
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: user.isOnline ? "#10b981" : "#9ca3af",
                  border: "2px solid #fff",
                  boxShadow: "0 0 2px rgba(0,0,0,0.2)",
                }}
              />

              <div>
                <b style={{ display: "block" }}>{user.name}</b>
                {!user.isOnline && user.lastSeen && (
                  <small style={{ color: "#666", fontSize: "11px" }}>
                    Last seen:{" "}
                    {new Date(user.lastSeen).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                )}
                <small
                  style={{
                    color: user.isOnline ? "#10b981" : "#6b7280",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  {user.isOnline ? "Online" : "Offline"}
                </small>
              </div>
            </div>

            <button
              onClick={() => startChat(user._id)}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
