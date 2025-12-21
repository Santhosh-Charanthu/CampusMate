"use client";

import { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";
import Comments from "./Comments";
import styles from "./post-card.module.css";

export default function PostCard({
  user,
  content,
  caption,
  post,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const toggleComments = () => setShowComments((s) => !s);

  const addComment = (c) => setComments((s) => [...s, c]);

  return (
    <div className={styles.card}>
      <PostHeader user={user} showFullCaption={showFullCaption} onToggleCaption={() => setShowFullCaption((s) => !s)} />
      <PostContent content={content} />
      <PostActions
        liked={liked}
        likes={likes}
        initialComments={initialComments}
        initialShares={initialShares}
        post={post}
        onLike={handleLike}
        onToggleComments={toggleComments}
      />
      <PostCaption
        user={user}
        caption={caption}
        showFullCaption={showFullCaption}
        setShowFullCaption={setShowFullCaption}
      />

      {showComments && (
        <Comments initial={comments} />
      )}
    </div>
  );
}
