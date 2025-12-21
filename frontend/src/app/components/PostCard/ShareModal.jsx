"use client";
import { useEffect, useState } from "react";
import styles from "./post-card.module.css";

export default function ShareModal({ post, onClose, onShared }) {
  const [followed, setFollowed] = useState([]);
  const [selected, setSelected] = useState({});
  const [shareToFeed, setShareToFeed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/users/me/following", {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const data = await res.json();
        setFollowed(data.following || []);
      } catch (e) {}
    };
    load();
  }, []);

  const toggle = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const handleShare = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const shareTo = Object.keys(selected).filter((k) => selected[k]);
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ shareToFeed, shareTo, text }),
      });
      const data = await res.json();
      setLoading(false);
      onShared && onShared(data);
      onClose && onClose();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shareModalBackdrop} onClick={onClose}>
      <div className={styles.shareModal} onClick={(e) => e.stopPropagation()}>
        <h3>Share post</h3>
        <textarea placeholder="Add a message" value={text} onChange={(e)=>setText(e.target.value)} className={styles.shareText} />

        <label className={styles.shareToFeed}><input type="checkbox" checked={shareToFeed} onChange={(e)=>setShareToFeed(e.target.checked)} /> Share to my feed</label>

        <div className={styles.followList}>
          <h4>Share with</h4>
          {followed.length === 0 && <div className={styles.empty}>You have no followed accounts yet</div>}
          {followed.map((f) => (
            <label key={f._id} className={styles.followItem}>
              <input type="checkbox" checked={!!selected[f._id]} onChange={()=>toggle(f._id)} />
              <img src={f.avatar || `/avatar-placeholder.png`} className={styles.followAvatar} />
              <span>{f.name}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button className={styles.btn} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} disabled={loading} onClick={handleShare}>{loading ? 'Sharing...' : 'Share'}</button>
        </div>
      </div>
    </div>
  );
}
