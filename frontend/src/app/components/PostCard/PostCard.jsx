"use client";

import { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";
import styles from "./post-card.module.css";

export default function PostCard({
  user,
  content,
  caption,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  return (
    <div className={styles.card}>
      <PostHeader user={user} />
      <PostContent content={content} />
      <PostActions
        liked={liked}
        likes={likes}
        initialComments={initialComments}
        initialShares={initialShares}
        onLike={handleLike}
      />
      <PostCaption
        user={user}
        caption={caption}
        showFullCaption={showFullCaption}
        setShowFullCaption={setShowFullCaption}
      />
    </div>
  );
}
