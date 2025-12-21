"use client";

import { useState } from "react";
import styles from "./leaderboard.module.css";

const leaderboardData = [
  {
    rank: 1,
    name: "Sarah Mitchell",
    username: "sarah_mitchell",
    avatar: "/user1.jpg",
    points: 12500,
    badges: ["Top Contributor", "Doubt Solver", "Active Streak"],
    change: "+2",
  },
  {
    rank: 2,
    name: "John Doe",
    username: "john_doe",
    avatar: "/user2.jpg",
    points: 11200,
    badges: ["Note Master", "Helpful"],
    change: "-1",
  },
  {
    rank: 3,
    name: "Jane Smith",
    username: "jane_smith",
    avatar: "/user3.jpg",
    points: 10800,
    badges: ["Active Streak"],
    change: "+1",
  },
  {
    rank: 4,
    name: "Mike Johnson",
    username: "mike_j",
    avatar: "/user4.jpg",
    points: 9500,
    badges: ["Doubt Solver"],
    change: "-2",
  },
  {
    rank: 5,
    name: "Emily Davis",
    username: "emily_d",
    avatar: "/user5.jpg",
    points: 8900,
    badges: ["Top Contributor"],
    change: "new",
  },
];

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("weekly");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leaderboard</h1>
        <div className={styles.timeframeTabs}>
          <button
            className={`${styles.tabButton} ${
              timeframe === "weekly" ? styles.tabButtonActive : ""
            }`}
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </button>
          <button
            className={`${styles.tabButton} ${
              timeframe === "monthly" ? styles.tabButtonActive : ""
            }`}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
          <button
            className={`${styles.tabButton} ${
              timeframe === "alltime" ? styles.tabButtonActive : ""
            }`}
            onClick={() => setTimeframe("alltime")}
          >
            All Time
          </button>
        </div>
      </div>

      <div className={styles.leaderboard}>
        {leaderboardData.map((user, index) => (
          <div
            key={user.rank}
            className={`${styles.leaderboardItem} ${
              index < 3 ? styles.topThree : ""
            }`}
          >
            <div className={styles.rankSection}>
              {index === 0 && (
                <div className={styles.medal}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFD700">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              )}
              {index === 1 && (
                <div className={styles.medal}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#C0C0C0">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              )}
              {index === 2 && (
                <div className={styles.medal}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#CD7F32">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              )}
              {index >= 3 && (
                <span className={styles.rankNumber}>#{user.rank}</span>
              )}
            </div>

            <div className={styles.userSection}>
              <div className={styles.avatar}>
                <img
                  src={user.avatar || "/placeholder-avatar.jpg"}
                  alt={user.name}
                />
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.name}</h3>
                <p className={styles.userUsername}>@{user.username}</p>
                <div className={styles.badges}>
                  {user.badges.map((badge, idx) => (
                    <span key={idx} className={styles.badge}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.pointsSection}>
              <div className={styles.points}>
                <span className={styles.pointsValue}>
                  {formatNumber(user.points)}
                </span>
                <span className={styles.pointsLabel}>points</span>
              </div>
              <div
                className={`${styles.change} ${
                  user.change.startsWith("+")
                    ? styles.changeUp
                    : user.change.startsWith("-")
                    ? styles.changeDown
                    : styles.changeNew
                }`}
              >
                {user.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>How to earn points?</h3>
        <div className={styles.pointRules}>
          <div className={styles.rule}>
            <span className={styles.ruleIcon}>💡</span>
            <div>
              <span className={styles.ruleAction}>Solve a doubt</span>
              <span className={styles.rulePoints}>+50 points</span>
            </div>
          </div>
          <div className={styles.rule}>
            <span className={styles.ruleIcon}>📝</span>
            <div>
              <span className={styles.ruleAction}>Upload notes/resources</span>
              <span className={styles.rulePoints}>+30 points</span>
            </div>
          </div>
          <div className={styles.rule}>
            <span className={styles.ruleIcon}>🔥</span>
            <div>
              <span className={styles.ruleAction}>Daily active streak</span>
              <span className={styles.rulePoints}>+10 points/day</span>
            </div>
          </div>
          <div className={styles.rule}>
            <span className={styles.ruleIcon}>❤️</span>
            <div>
              <span className={styles.ruleAction}>Post engagement</span>
              <span className={styles.rulePoints}>+5 points per like</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


