import styles from "./post-card.module.css";
import MoreIcon from "./icons/MoreIcon";

export default function PostHeader({ user }) {
  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className={styles.avatarImage}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.time}>Just now</span>
      </div>

      <button className={styles.more}>
        <MoreIcon />
      </button>
    </div>
  );
}
