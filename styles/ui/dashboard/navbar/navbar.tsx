"use client";
import { usePathname } from "next/navigation";
import styles from "../../../navbar.module.css";
import { LuSearch, LuMessageCircle, LuBell, LuGlobe } from "react-icons/lu";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <LuSearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <LuMessageCircle size={20} />
          <LuBell size={20} />
          <LuGlobe size={20} />
        </div>
      </div>
    </div>
  );
}
