"use client";

import { useState } from "react";
import styles from "./profile.module.css";

// Sample posts data
const allPosts = [
  {
    id: 1,
    image: "/sunset-beach-photography.png",
    likes: 1234,
    comments: 56,
    isVideo: false,
  },
  {
    id: 2,
    image: "/city-skyline-night-photography.jpg",
    likes: 892,
    comments: 34,
    isVideo: false,
  },
  {
    id: 3,
    image: "/serene-mountain-landscape.png",
    likes: 2341,
    comments: 89,
    isVideo: true,
  },
  {
    id: 4,
    image: "/cozy-coffee-shop.png",
    likes: 567,
    comments: 23,
    isVideo: false,
  },
  {
    id: 5,
    image: "/travel-adventure-hiking.jpg",
    likes: 1876,
    comments: 67,
    isVideo: false,
  },
  {
    id: 6,
    image: "/restaurant-food-photography.png",
    likes: 445,
    comments: 18,
    isVideo: false,
  },
  {
    id: 7,
    image: "/fashion-street-style-photography.jpg",
    likes: 3210,
    comments: 102,
    isVideo: true,
  },
  {
    id: 8,
    image: "/wildlife-photography.png",
    likes: 987,
    comments: 45,
    isVideo: false,
  },
  {
    id: 9,
    image: "/architecture-modern-building.jpg",
    likes: 654,
    comments: 29,
    isVideo: false,
  },
  {
    id: 10,
    image: "/art-gallery-exhibition.jpg",
    likes: 1123,
    comments: 51,
    isVideo: false,
  },
  {
    id: 11,
    image: "/ocean-waves-surfing.jpg",
    likes: 2567,
    comments: 78,
    isVideo: true,
  },
  {
    id: 12,
    image: "/minimalist-interior.png",
    likes: 789,
    comments: 32,
    isVideo: false,
  },
];

// Sample saved posts (subset of posts)
const savedPosts = [
  {
    id: 1,
    image: "/sunset-beach-photography.png",
    likes: 1234,
    comments: 56,
    isVideo: false,
  },
  {
    id: 4,
    image: "/cozy-coffee-shop.png",
    likes: 567,
    comments: 23,
    isVideo: false,
  },
  {
    id: 6,
    image: "/restaurant-food-photography.png",
    likes: 445,
    comments: 18,
    isVideo: false,
  },
];

// Helper function to format numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Icons as SVG components
function GridIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CommentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function VideoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ReelsIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function SavedIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" />
    </svg>
  );
}

function MessageIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MoreIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
    </svg>
  );
}

function VerifiedIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2L12 21.04l3.4 1.47 1.89-3.2 3.61-.82-.34-3.7L23 12zm-10 5l-5-5 1.41-1.41L12 14.17l3.59-3.58L17 12l-5 5z" />
    </svg>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Toggle this to simulate viewing your own profile vs someone else's
  const isOwnProfile = true;

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (activeTab === "posts") {
      return allPosts.filter((post) => !post.isVideo);
    } else if (activeTab === "reels") {
      return allPosts.filter((post) => post.isVideo);
    } else if (activeTab === "saved") {
      return savedPosts;
    }
    return [];
  };

  const filteredPosts = getFilteredPosts();

  const handleTabChange = (tab) => {
    setIsLoading(true);
    setActiveTab(tab);
    // Simulate loading for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };
  return (
    <div className={styles.container}>
      {/* Profile Header Section */}
      <header className={styles.profileHeader}>
        <div className={styles.profileHeaderContent}>
          {/* Avatar */}
          <div className={styles.avatarContainer}>
            <img
              src="data:image/png;base64,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"
              alt="Profile picture"
              className={styles.avatar}
            />
          </div>

          {/* User Info Section */}
          <div className={styles.userInfoSection}>
            {/* Username and Action Buttons */}
            <div className={styles.usernameRow}>
              <div className={styles.usernameContainer}>
                <h1 className={styles.username}>sarah_mitchell</h1>
                <VerifiedIcon className={styles.verifiedBadge} />
              </div>
              <div className={styles.actionButtons}>
                {isOwnProfile ? (
                  <button className={styles.editProfileButton} aria-label="Edit profile">
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button 
                      className={`${styles.editProfileButton} ${isFollowing ? styles.following : ""}`}
                      onClick={handleFollowToggle}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button 
                      className={styles.messageButton}
                      aria-label="Message"
                    >
                      <MessageIcon className={styles.messageIcon} />
                    </button>
                    <button className={styles.shareButton} aria-label="Share profile">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                    <button className={styles.moreButton} aria-label="More options">
                      <MoreIcon className={styles.moreIcon} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <button className={styles.statItem} onClick={() => console.log("Posts clicked")}>
                <span className={styles.statNumber}>{formatNumber(12)}</span>
                <span className={styles.statLabel}>posts</span>
              </button>
              <button className={styles.statItem} onClick={() => console.log("Followers clicked")}>
                <span className={styles.statNumber}>{formatNumber(24500)}</span>
                <span className={styles.statLabel}>followers</span>
              </button>
              <button className={styles.statItem} onClick={() => console.log("Following clicked")}>
                <span className={styles.statNumber}>{formatNumber(892)}</span>
                <span className={styles.statLabel}>following</span>
              </button>
            </div>

            {/* Bio */}
            <div className={styles.bioSection}>
              <h2 className={styles.displayName}>Sarah Mitchell</h2>
              <p className={styles.bio}>
                Digital creator & photographer 📸<br />
                Capturing moments that matter.<br />
                Based in San Francisco<br />
                Let's create something beautiful together ✨
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Story Highlights Section */}
      <section className={styles.highlightsSection}>
        <div className={styles.highlightsContainer}>
          <button className={styles.highlightItem}>
            <div className={styles.highlightCircle}>
              <span className={styles.highlightPlus}>+</span>
            </div>
            <span className={styles.highlightLabel}>New</span>
          </button>
          <button className={styles.highlightItem}>
            <div className={styles.highlightCircle}>
              <img src="data:image/png;base64,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" alt="Highlight" className={styles.highlightImage} />
            </div>
            <span className={styles.highlightLabel}>Travel</span>
          </button>
          <button className={styles.highlightItem}>
            <div className={styles.highlightCircle}>
              <img src="data:image/png;base64,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" alt="Highlight" className={styles.highlightImage} />
            </div>
            <span className={styles.highlightLabel}>Food</span>
          </button>
          <button className={styles.highlightItem}>
            <div className={styles.highlightCircle}>
              <img src="data:image/png;base64,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" alt="Highlight" className={styles.highlightImage} />
            </div>
            <span className={styles.highlightLabel}>Art</span>
          </button>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className={styles.postsSection}>
        <div className={styles.postsTabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "posts" ? styles.tabButtonActive : ""
            }`}
            onClick={() => handleTabChange("posts")}
          >
            <GridIcon className={styles.tabIcon} />
            <span>POSTS</span>
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "reels" ? styles.tabButtonActive : ""
            }`}
            onClick={() => handleTabChange("reels")}
          >
            <ReelsIcon className={styles.tabIcon} />
            <span>REELS</span>
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "saved" ? styles.tabButtonActive : ""
            }`}
            onClick={() => handleTabChange("saved")}
          >
            <SavedIcon className={styles.tabIcon} />
            <span>SAVED</span>
          </button>
        </div>
        <div className={`${styles.postsGrid} ${isLoading ? styles.loading : ""}`}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className={styles.postItem}>
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={`Post ${post.id}`}
                  className={styles.postImage}
                  loading="lazy"
                />
                {/* Video Indicator */}
                {post.isVideo && (
                  <div className={styles.videoIndicator}>
                    <VideoIcon className={styles.videoIcon} />
                  </div>
                )}
                {/* Hover Overlay */}
                <div className={styles.postOverlay}>
                  <div className={styles.overlayStat}>
                    <HeartIcon className={styles.overlayIcon} />
                    <span>{formatNumber(post.likes)}</span>
                  </div>
                  <div className={styles.overlayStat}>
                    <CommentIcon className={styles.overlayIcon} />
                    <span>{formatNumber(post.comments)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                {activeTab === "posts" && <GridIcon className={styles.emptyIconSvg} />}
                {activeTab === "reels" && <ReelsIcon className={styles.emptyIconSvg} />}
                {activeTab === "saved" && <SavedIcon className={styles.emptyIconSvg} />}
              </div>
              <h3 className={styles.emptyTitle}>
                {activeTab === "posts" && "No Posts Yet"}
                {activeTab === "reels" && "No Reels Yet"}
                {activeTab === "saved" && "No Saved Posts"}
              </h3>
              <p className={styles.emptyText}>
                {activeTab === "posts" && "When you share photos, they will appear here."}
                {activeTab === "reels" && "When you share reels, they will appear here."}
                {activeTab === "saved" && "Save photos and videos that you want to see again."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
