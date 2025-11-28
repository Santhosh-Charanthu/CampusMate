import styles from "./post-card.module.css";

export default function PostContent({ content }) {
  return (
    <div className={styles.content}>
      {content.type === "text" && (
        <p className={styles.textContent}>{content.src}</p>
      )}

      {content.type === "image" && (
        <img
          src={content.src}
          alt={content.alt}
          className={styles.mediaContent}
        />
      )}

      {content.type === "video" && (
        <video controls className={styles.mediaContent}>
          <source src={content.src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
