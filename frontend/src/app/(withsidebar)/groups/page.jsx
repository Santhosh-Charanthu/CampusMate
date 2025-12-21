"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./groups.module.css";

// Sample groups data
const sampleGroups = [
  {
    id: 1,
    name: "Computer Science Club",
    description: "Join us for coding sessions, hackathons, and tech discussions",
    category: "club",
    type: "public",
    members: 245,
    coverImage: "/cs-club.jpg",
    isJoined: true,
  },
  {
    id: 2,
    name: "Data Structures & Algorithms",
    description: "Study group for DSA concepts, problem solving, and interview prep",
    category: "academic",
    type: "public",
    members: 189,
    coverImage: "/dsa-group.jpg",
    isJoined: false,
  },
  {
    id: 3,
    name: "Photography Enthusiasts",
    description: "Share your photos, learn techniques, and explore campus through lens",
    category: "interest",
    type: "public",
    members: 156,
    coverImage: "/photo-group.jpg",
    isJoined: true,
  },
  {
    id: 4,
    name: "Startup Founders",
    description: "Private group for aspiring entrepreneurs and startup founders",
    category: "project",
    type: "private",
    members: 42,
    coverImage: "/startup-group.jpg",
    isJoined: false,
  },
];

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredGroups = sampleGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || group.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Groups</h1>
        <Link href="/groups/create" className={styles.createButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Group
        </Link>
      </div>

      {/* Search and Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search groups..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categoryFilters}>
          <button
            className={`${styles.filterButton} ${
              filterCategory === "all" ? styles.filterButtonActive : ""
            }`}
            onClick={() => setFilterCategory("all")}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${
              filterCategory === "club" ? styles.filterButtonActive : ""
            }`}
            onClick={() => setFilterCategory("club")}
          >
            Clubs
          </button>
          <button
            className={`${styles.filterButton} ${
              filterCategory === "academic" ? styles.filterButtonActive : ""
            }`}
            onClick={() => setFilterCategory("academic")}
          >
            Academic
          </button>
          <button
            className={`${styles.filterButton} ${
              filterCategory === "interest" ? styles.filterButtonActive : ""
            }`}
            onClick={() => setFilterCategory("interest")}
          >
            Interests
          </button>
          <button
            className={`${styles.filterButton} ${
              filterCategory === "project" ? styles.filterButtonActive : ""
            }`}
            onClick={() => setFilterCategory("project")}
          >
            Projects
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className={styles.groupsGrid}>
        {filteredGroups.map((group) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className={styles.groupCard}
          >
            <div className={styles.groupCover}>
              <img
                src={group.coverImage || "/placeholder-group.jpg"}
                alt={group.name}
                className={styles.coverImage}
              />
              {group.type === "private" && (
                <div className={styles.privateBadge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 11h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v4H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 7c0-1.66 1.34-3 3-3s3 1.34 3 3v4H9V7z" />
                  </svg>
                  Private
                </div>
              )}
            </div>
            <div className={styles.groupInfo}>
              <h3 className={styles.groupName}>{group.name}</h3>
              <p className={styles.groupDescription}>{group.description}</p>
              <div className={styles.groupMeta}>
                <span className={styles.memberCount}>
                  {formatNumber(group.members)} members
                </span>
                {group.isJoined && (
                  <span className={styles.joinedBadge}>Joined</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


