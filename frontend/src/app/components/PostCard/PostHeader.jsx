import styles from "./post-card.module.css";
import MoreIcon from "./icons/MoreIcon";
import { useState, useEffect } from "react";

export default function PostHeader({ user, showFullCaption, onToggleCaption }) {
  const [following, setFollowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const followToggle = async () => {
    // optimistic UI
    setFollowing((f) => !f);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      if (!following) {
        const res = await fetch(`http://localhost:5000/api/users/${user._id}/follow`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const data = await res.json().catch(()=>null);
        if (data?.success) {
          // update stored current user following list if present
          try {
            const me = JSON.parse(localStorage.getItem('currentUser')||'null');
            if (me) {
              me.following = me.following || [];
              me.following.push(user._id);
              localStorage.setItem('currentUser', JSON.stringify(me));
            }
          } catch(e){}
        }
      } else {
        const res = await fetch(`http://localhost:5000/api/users/${user._id}/unfollow`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const data = await res.json().catch(()=>null);
        if (data?.success) {
          try {
            const me = JSON.parse(localStorage.getItem('currentUser')||'null');
            if (me && Array.isArray(me.following)) {
              me.following = me.following.filter((id)=> id !== user._id && id !== user.id);
              localStorage.setItem('currentUser', JSON.stringify(me));
            }
          } catch(e){}
        }
      }
    } catch (e) {
      // revert on failure
      setFollowing((f) => !f);
    }
  };

  useEffect(() => {
    try {
      // if we have a token, ask backend for current user's following list
      const token = localStorage.getItem("token");
      if (token) {
        fetch("http://localhost:5000/api/users/me/following", { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((data) => {
            const f = data?.following || [];
            setFollowing(f.some((u) => u._id === user._id || u._id === user.id));
          })
          .catch(() => {});
      } else {
        const me = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (me && Array.isArray(me.following)) {
          setFollowing(me.following.some((id) => id === user._id || id === user.id));
        }
      }
    } catch (e) {}
  }, [user]);

  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className={styles.avatarImage}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.time}>Just now</span>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative" }}>
        <button
          className={`${styles.followBtn} ${following ? styles.following : ""}`}
          onClick={followToggle}
        >
          {following ? "Following" : "Follow"}
        </button>

        <button className={styles.more} onClick={() => setMenuOpen((m) => !m)}>
          <MoreIcon />
        </button>

        {menuOpen && (
          <div className={styles.moreMenu} onMouseLeave={() => setMenuOpen(false)}>
            <button
              className={styles.moreMenuItem}
              onClick={() => {
                onToggleCaption && onToggleCaption();
                setMenuOpen(false);
              }}
            >
              {showFullCaption ? "Show Less" : "Show More"}
            </button>
            <button className={styles.moreMenuItem}>Report</button>
            <button className={styles.moreMenuItem}>Copy link</button>
          </div>
        )}
      </div>
    </div>
  );
}
