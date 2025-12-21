"use client";

import { useState } from "react";
import styles from "./post-card.module.css";

export default function Comments({ initial = [] }) {
  const [comments, setComments] = useState(initial || []);
  const [text, setText] = useState("");

  const addComment = () => {
    if (!text.trim()) return;
    const c = { id: Date.now(), user: { name: "You" }, text };
    setComments((s) => [...s, c]);
    setText("");
  };

  return (
    <div className={styles.commentsWrap}>
      <div className={styles.commentsList}>
        {comments.map((c) => (
          <div key={c.id} className={styles.commentItem}>
            <div className={styles.commentAvatar}>{c.user.name.charAt(0)}</div>
            <div>
              <div className={styles.commentUser}>{c.user.name}</div>
              <div className={styles.commentText}>{c.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.commentInputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className={styles.commentInput}
        />
        <button className={styles.commentBtn} onClick={addComment}>
          Comment
        </button>
      </div>
    </div>
  );
}
