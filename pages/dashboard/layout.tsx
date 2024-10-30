import React from "react";
import Sidebar from "../../styles/ui/dashboard/sidebar/sidebar";
import Navbar from "../../styles/ui/dashboard/navbar/navbar";
import Footer from "../../styles/ui/dashboard/footer/footer";

import styles from "../../styles/dashboard.module.css";

export default function Layout({ children }: any) {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
}
