<<<<<<< HEAD
"use client"

import { useState } from "react"
import "./leaderboard.css"

// Mock leaderboard data
const mockLeaderboards = {
  weekly: [
    { id: 1, rank: 1, name: "Priya Sharma", branch: "CSE", year: "3rd", points: 2850, avatar: "PS" },
    { id: 2, rank: 2, name: "Rahul Kumar", branch: "IT", year: "4th", points: 2720, avatar: "RK" },
    { id: 3, rank: 3, name: "Anjali Verma", branch: "AIML", year: "3rd", points: 2680, avatar: "AV" },
    { id: 4, rank: 4, name: "Amit Patel", branch: "ECE", year: "2nd", points: 2450, avatar: "AP" },
    { id: 5, rank: 5, name: "Sneha Reddy", branch: "CSE", year: "3rd", points: 2320, avatar: "SR" },
    { id: 6, rank: 6, name: "Vikram Singh", branch: "AIDS", year: "4th", points: 2180, avatar: "VS" },
    { id: 7, rank: 7, name: "Kavya Menon", branch: "IT", year: "2nd", points: 2050, avatar: "KM" },
    { id: 8, rank: 8, name: "Arjun Nair", branch: "MECH", year: "3rd", points: 1980, avatar: "AN" },
    {
      id: 9,
      rank: 9,
      name: "Divya Joshi",
      branch: "CSE",
      year: "4th",
      points: 1850,
      avatar: "DJ",
      isCurrentUser: true,
    },
    { id: 10, rank: 10, name: "Rohan Gupta", branch: "CIVIL", year: "2nd", points: 1720, avatar: "RG" },
  ],
  monthly: [
    { id: 1, rank: 1, name: "Rahul Kumar", branch: "IT", year: "4th", points: 8950, avatar: "RK" },
    { id: 2, rank: 2, name: "Priya Sharma", branch: "CSE", year: "3rd", points: 8720, avatar: "PS" },
    { id: 3, rank: 3, name: "Sneha Reddy", branch: "CSE", year: "3rd", points: 8350, avatar: "SR" },
    { id: 4, rank: 4, name: "Anjali Verma", branch: "AIML", year: "3rd", points: 7890, avatar: "AV" },
    { id: 5, rank: 5, name: "Vikram Singh", branch: "AIDS", year: "4th", points: 7650, avatar: "VS" },
    { id: 6, rank: 6, name: "Kavya Menon", branch: "IT", year: "2nd", points: 7420, avatar: "KM" },
    { id: 7, rank: 7, name: "Amit Patel", branch: "ECE", year: "2nd", points: 7280, avatar: "AP" },
    {
      id: 8,
      rank: 8,
      name: "Divya Joshi",
      branch: "CSE",
      year: "4th",
      points: 6950,
      avatar: "DJ",
      isCurrentUser: true,
    },
    { id: 9, rank: 9, name: "Arjun Nair", branch: "MECH", year: "3rd", points: 6720, avatar: "AN" },
    { id: 10, rank: 10, name: "Rohan Gupta", branch: "CIVIL", year: "2nd", points: 6450, avatar: "RG" },
  ],
  allTime: [
    { id: 1, rank: 1, name: "Sneha Reddy", branch: "CSE", year: "3rd", points: 45820, avatar: "SR" },
    { id: 2, rank: 2, name: "Rahul Kumar", branch: "IT", year: "4th", points: 43950, avatar: "RK" },
    { id: 3, rank: 3, name: "Vikram Singh", branch: "AIDS", year: "4th", points: 42780, avatar: "VS" },
    { id: 4, rank: 4, name: "Priya Sharma", branch: "CSE", year: "3rd", points: 41650, avatar: "PS" },
    { id: 5, rank: 5, name: "Kavya Menon", branch: "IT", year: "2nd", points: 39420, avatar: "KM" },
    { id: 6, rank: 6, name: "Anjali Verma", branch: "AIML", year: "3rd", points: 38760, avatar: "AV" },
    { id: 7, rank: 7, name: "Amit Patel", branch: "ECE", year: "2nd", points: 37590, avatar: "AP" },
    { id: 8, rank: 8, name: "Arjun Nair", branch: "MECH", year: "3rd", points: 36280, avatar: "AN" },
    { id: 9, rank: 9, name: "Rohan Gupta", branch: "CIVIL", year: "2nd", points: 34950, avatar: "RG" },
    {
      id: 10,
      rank: 10,
      name: "Divya Joshi",
      branch: "CSE",
      year: "4th",
      points: 33720,
      avatar: "DJ",
      isCurrentUser: true,
    },
  ],
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("weekly")

  const currentLeaderboard = mockLeaderboards[activeTab]

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return null
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">See how students rank based on their contributions</p>
      </div>

      <div className="tab-switcher">
        <button
          className={`tab-button ${activeTab === "weekly" ? "active" : ""}`}
          onClick={() => setActiveTab("weekly")}
        >
          Weekly
        </button>
        <button
          className={`tab-button ${activeTab === "monthly" ? "active" : ""}`}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly
        </button>
        <button
          className={`tab-button ${activeTab === "allTime" ? "active" : ""}`}
          onClick={() => setActiveTab("allTime")}
        >
          All-Time
        </button>
      </div>

      <div className="leaderboard-list">
        {currentLeaderboard.map((student) => (
          <div
            key={student.id}
            className={`leaderboard-card ${
              student.rank <= 3 ? `rank-${student.rank}` : ""
            } ${student.isCurrentUser ? "current-user" : ""}`}
          >
            <div className="rank-section">
              <div className="rank-number">{student.rank}</div>
              {getRankBadge(student.rank) && <div className="rank-badge">{getRankBadge(student.rank)}</div>}
            </div>

            <div className="avatar">{student.avatar}</div>

            <div className="student-info">
              <div className="student-name">
                {student.name}
                {student.isCurrentUser && <span className="you-label">You</span>}
              </div>
              <div className="student-meta">
                {student.branch} • {student.year} Year
              </div>
            </div>

            <div className="points-section">
              <div className="points-value">{student.points.toLocaleString()}</div>
              <div className="points-label">points</div>
=======
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
>>>>>>> origin/adi
            </div>
          </div>
        ))}
      </div>
<<<<<<< HEAD
    </div>
  )
}
=======

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


>>>>>>> origin/adi
