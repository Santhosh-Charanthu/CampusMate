"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ShareBox.module.css";

export default function ShareBox({ onCreate }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const [articleMode, setArticleMode] = useState(false);
  const [articleTitle, setArticleTitle] = useState("");

  const handlePost = () => {
    if (!text.trim() && !media) return;
    setLoading(true);
    const newPost = {
      user: { name: "You" },
      content: media ? media : { type: "text", src: text },
      caption: text,
      initialLikes: 0,
      initialComments: 0,
      initialShares: 0,
    };
    // simulate small delay
    setTimeout(() => {
      onCreate && onCreate(newPost);
      setText("");
      setMedia(null);
      setLoading(false);
      setArticleTitle("");
      setArticleMode(false);
    }, 250);
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      const type = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
        ? "video"
        : "file";
      setMedia({ type, src, alt: file.name });
    };
    reader.readAsDataURL(file);
  };

  const pickMedia = (accept) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e) => handleFile(e.target.files[0]);
    input.click();
  };

  const removeMedia = () => setMedia(null);

  return (
    <div className={styles.shareBox}>
      <div className={styles.composerTop}>
        <div className={styles.createLabel}>Create a post</div>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Share an article, photo, or idea..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      {media && (
        <div className={styles.mediaPreview}>
          {media.type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.src} alt={media.alt} className={styles.previewImage} />
          )}
          {media.type === "video" && (
            <video controls src={media.src} className={styles.previewImage} />
          )}
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <button className={styles.tool} onClick={removeMedia}>
              Remove
            </button>
          </div>
        </div>
      )}

      {articleMode && (
        <div className={styles.articleMeta}>
          <input
            className={styles.articleTitle}
            placeholder="Article title"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
          />
          <div className={styles.articleHint}>Article mode: publish handled elsewhere</div>
        </div>
      )}

      <div className={styles.toolbarRow}>
        <div className={styles.toolbarLeft}>
          <button className={styles.iconBtn} onClick={() => pickMedia("video/*")}>
            <span className={styles.iconBox}>▶</span>
            <span>Video</span>
          </button>

          <button className={styles.iconBtn} onClick={() => pickMedia("image/*") }>
            <span className={styles.iconBox}>🖼️</span>
            <span>Photo</span>
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => setArticleMode((a) => !a)}
          >
            <span className={styles.iconBox}>📝</span>
            <span>Write article</span>
          </button>
        </div>

        <div className={styles.toolbarRight}>
          {!articleMode && (
            <button
              className={styles.postBtn}
              onClick={handlePost}
              disabled={loading || (!text.trim() && !media)}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          )}

          {articleMode && (
            <button className={styles.cancelBtn} onClick={() => setArticleMode(false)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
