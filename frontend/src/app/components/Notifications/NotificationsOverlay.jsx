"use client";
import { useEffect } from "react";
import styles from "./NotificationsOverlay.module.css";

export default function NotificationsOverlay({ open, onClose }) {
  // Close when clicking outside overlay
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.classList.contains(styles.overlayBackground)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const main = document.getElementById("mainContent");

    if (open) {
      document.body.style.overflow = "hidden";
      if (main) main.style.overflow = "hidden"; // 🛑 freeze main scroll
    } else {
      document.body.style.overflow = "auto";
      if (main) main.style.overflow = "auto"; // ✅ restore main scroll
    }

    return () => {
      document.body.style.overflow = "auto";
      if (main) main.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlayBackground}>
      <div className={styles.panel}>
        <h2 className={styles.title}>Notifications</h2>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>This Week</h4>

          {/* Single notification example */}
          <div className={styles.notificationItem}>
            <img src="/user1.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>John Doe</strong> liked your post.{" "}
              <span className={styles.time}>3d</span>
            </p>
          </div>

          <div className={styles.notificationItem}>
            <img src="/user2.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>Emma Wilson</strong> commented on your post.{" "}
              <span className={styles.time}>1d</span>
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>This Month</h4>

          <div className={styles.notificationItem}>
            <img src="/user3.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>Mike Chen</strong> started following you.{" "}
              <span className={styles.time}>6d</span>
            </p>
          </div>
          <div className={styles.notificationItem}>
            <img src="/user3.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>Mike Chen</strong> started following you.{" "}
              <span className={styles.time}>6d</span>
            </p>
          </div>
          <div className={styles.notificationItem}>
            <img src="/user3.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>Mike Chen</strong> started following you.{" "}
              <span className={styles.time}>6d</span>
            </p>
          </div>
          <div className={styles.notificationItem}>
            <img src="/user3.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>Mike Chen</strong> started following you.{" "}
              <span className={styles.time}>6d</span>
            </p>
          </div>
          <div className={styles.notificationItem}>
            <img src="/user3.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>Mike Chen</strong> started following you.{" "}
              <span className={styles.time}>6d</span>
            </p>
          </div>
          <div className={styles.notificationItem}>
            <img src="/user3.jpg" className={styles.avatar} alt="user" />
            <p className={styles.text}>
              <strong>Mike Chen</strong> started following you.{" "}
              <span className={styles.time}>6d</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
