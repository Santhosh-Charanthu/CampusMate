"use client";

import { useState } from "react";
import styles from "./Sidebar.module.css";

const suggestions = [
  { name: "Alice Johnson", title: "Software Engineer" },
  { name: "Bob Lee", title: "Product Designer" },
  { name: "Carla Gomez", title: "Data Scientist" },
];

export default function SidebarSuggestions({ compact = false }) {
  const [following, setFollowing] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [followedList, setFollowedList] = useState([]);

  const toggleFollow = (s) => {
    // s is the suggestion object
    setFollowing((prev) => ({ ...prev, [s.name]: !prev[s.name] }));
    if (!following[s.name]) {
      setFollowedList((f) => [s, ...f]);
    } else {
      setFollowedList((f) => f.filter((x) => x.name !== s.name));
    }
  };

  const list = expanded ? [...suggestions, { name: 'Eve Park', title: 'DevOps' }, { name: 'Frank Wu', title: 'QA Engineer' }] : suggestions;

  return (
    <div className={styles.sidebarCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 className={styles.title}>People you may know</h4>
        {!compact && (
          <button className={styles.moreLink} onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Show less' : 'See more'}
          </button>
        )}
      </div>

      {followedList.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <h5 className={styles.subTitle}>Followed</h5>
          <ul className={styles.list}>
            {followedList.map((s) => (
              <li key={s.name} className={styles.item}>
                <div>
                  <div className={styles.suggestName}>{s.name}</div>
                  <div className={styles.suggestTitle}>{s.title}</div>
                </div>
                <button
                  className={`${styles.followBtn} ${following[s.name] ? styles.following : ""}`}
                  onClick={() => toggleFollow(s)}
                >
                  {following[s.name] ? "Following" : "Follow"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className={styles.list}>
        {list.map((s) => (
          <li key={s.name} className={styles.item}>
            <div>
              <div className={styles.suggestName}>{s.name}</div>
              <div className={styles.suggestTitle}>{s.title}</div>
            </div>
            <button
              className={`${styles.followBtn} ${following[s.name] ? styles.following : ""}`}
              onClick={() => toggleFollow(s)}
            >
              {following[s.name] ? "Following" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
