import React from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.whiteBackground} />
        <div className={styles.borderLayer} />
        <div className={styles.glow} />

        <div className={styles.main}>
          <input placeholder="Search..." type="text" className={styles.input} />

          <div className={styles.searchIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              viewBox="0 0 24 24"
              strokeWidth={2}
              height={24}
              fill="none"
              stroke="#777"
            >
              <circle r={8} cy={11} cx={11} />
              <line y2="16.65" y1={22} x2="16.65" x1={22} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
