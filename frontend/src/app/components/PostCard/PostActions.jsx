"use client";

import { useState } from "react";
import styles from "./post-card.module.css";
import HeartIcon from "./icons/HeartIcon";
import CommentIcon from "./icons/CommentIcon";
import ShareIcon from "./icons/ShareIcon";
import ShareModal from "./ShareModal";

export default function PostActions({
  liked,
  likes,
  initialComments,
  initialShares,
  onLike,
  onToggleComments,
}) {
  const [shares, setShares] = useState(initialShares || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = () => {
    // open share modal instead of instant share
    setShowShareModal(true);
    setMenuOpen(false);
  };

  return (
    <div className={styles.actions}>
      <button
        className={`${styles.actionButton} ${liked ? styles.liked : ""}`}
        onClick={onLike}
      >
        <HeartIcon filled={liked} />
        <span>{likes || "Like"}</span>
      </button>

      <button className={styles.actionButton} onClick={() => onToggleComments && onToggleComments()}>
        <CommentIcon />
        <span>{initialComments || "Comment"}</span>
      </button>

      <div style={{ position: "relative", flex: 1 }}>
        <button
          className={styles.actionButton}
          onClick={() => setMenuOpen((m) => !m)}
        >
          <ShareIcon />
          <span>{shares || "Share"}</span>
        </button>

        {menuOpen && (
          <div className={styles.shareMenu}>
            <button className={styles.shareOption} onClick={handleShare}>
              Share (open dialog)
            </button>
            <button
              className={styles.shareOption}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ text: "Check out this post" }).catch(() => {});
                } else {
                  // fallback: copy to clipboard
                  try {
                    navigator.clipboard && navigator.clipboard.writeText(window.location.href);
                  } catch {}
                }
                setMenuOpen(false);
              }}
            >
              Share Externally
            </button>
          </div>
        )}
        {showShareModal && (
          <ShareModal post={post} onClose={() => setShowShareModal(false)} onShared={() => { setShares((s) => s + 1); setShowShareModal(false); }} />
        )}
      </div>
    </div>
  );
}
