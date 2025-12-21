"use client";

import { useState } from "react";
import styles from "./messaging.module.css";

const sampleChats = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/user1.jpg",
    lastMessage: "Hey, are you coming to the study session?",
    timestamp: "2m ago",
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "CS Study Group",
    avatar: "/group1.jpg",
    lastMessage: "Sarah: The assignment is due tomorrow",
    timestamp: "1h ago",
    unread: 5,
    isGroup: true,
    members: 12,
  },
  {
    id: 3,
    name: "Jane Smith",
    avatar: "/user2.jpg",
    lastMessage: "Thanks for the notes!",
    timestamp: "3h ago",
    unread: 0,
    isOnline: false,
  },
];

export default function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  return (
    <div className={styles.container}>
      {/* Chat List Sidebar */}
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>
          <h2 className={styles.chatListTitle}>Messages</h2>
          <button className={styles.newChatButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search messages..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.chats}>
          {sampleChats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${
                selectedChat?.id === chat.id ? styles.chatItemActive : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className={styles.chatAvatar}>
                <img src={chat.avatar || "/placeholder-avatar.jpg"} alt={chat.name} />
                {chat.isOnline && <span className={styles.onlineIndicator}></span>}
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <span className={styles.chatName}>{chat.name}</span>
                  <span className={styles.chatTime}>{chat.timestamp}</span>
                </div>
                <div className={styles.chatFooter}>
                  <span className={styles.chatMessage}>{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <span className={styles.unreadBadge}>{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        {selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatHeaderAvatar}>
                  <img
                    src={selectedChat.avatar || "/placeholder-avatar.jpg"}
                    alt={selectedChat.name}
                  />
                  {selectedChat.isOnline && (
                    <span className={styles.onlineIndicator}></span>
                  )}
                </div>
                <div>
                  <h3 className={styles.chatHeaderName}>{selectedChat.name}</h3>
                  {selectedChat.isGroup && (
                    <p className={styles.chatHeaderMeta}>
                      {selectedChat.members} members
                    </p>
                  )}
                  {!selectedChat.isGroup && (
                    <p className={styles.chatHeaderMeta}>
                      {selectedChat.isOnline ? "Active now" : "Offline"}
                    </p>
                  )}
                </div>
              </div>
              <button className={styles.chatHeaderButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>

            <div className={styles.messages}>
              <div className={styles.message}>
                <div className={styles.messageAvatar}>
                  <img src="/user1.jpg" alt="User" />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <p>Hey, are you coming to the study session?</p>
                    <span className={styles.messageTime}>2:30 PM</span>
                  </div>
                </div>
              </div>

              <div className={`${styles.message} ${styles.messageOwn}`}>
                <div className={styles.messageContent}>
                  <div className={`${styles.messageBubble} ${styles.messageBubbleOwn}`}>
                    <p>Yes, I'll be there!</p>
                    <span className={styles.messageTime}>2:32 PM</span>
                  </div>
                </div>
                <div className={styles.messageAvatar}>
                  <img src="/user-avatar.jpg" alt="Me" />
                </div>
              </div>
            </div>

            <div className={styles.messageInput}>
              <button className={styles.attachButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Message..."
                className={styles.input}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className={styles.sendButton} disabled={!message.trim()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h3 className={styles.emptyTitle}>Select a conversation</h3>
            <p className={styles.emptyText}>
              Choose a chat from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


