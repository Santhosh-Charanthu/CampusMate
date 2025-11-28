import styles from "./Sidebar.module.css";
import Image from "next/image";

// Lucide Icons
import {
  Bell,
  MessageCircle,
  Trophy,
  Search,
  Compass,
  PlusSquare,
  User,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>CampusMate</h2>

      <ul className={styles.menu}>
        <li>
          <Bell size={22} className={styles.icon} />
          Notifications
        </li>

        <li>
          <MessageCircle size={22} className={styles.icon} />
          Messaging
        </li>

        <li>
          <Trophy size={22} className={styles.icon} />
          Leaderboard
        </li>

        {/* <li>
          <Search size={22} className={styles.icon} />
          Search
        </li> */}

        <li>
          <Compass size={22} className={styles.icon} />
          Explore
        </li>

        <li>
          <PlusSquare size={22} className={styles.icon} />
          Create
        </li>

        <li className={styles.profile}>
          <Image
            src="/avatar.jpg"
            alt="Profile"
            width={28}
            height={28}
            className={styles.avatar}
          />
          Profile
        </li>
      </ul>
    </div>
  );
}
