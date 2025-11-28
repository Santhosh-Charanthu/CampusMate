import Image from "next/image";
import Dashboard from "./dashboard/page";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Dashboard />
      </main>
    </div>
  );
}
