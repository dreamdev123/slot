import React from "react";

import styles from "../../../card.module.css";

import { LuUsers, LuBadgePlus, LuPiggyBank } from "react-icons/lu";

type Props = {
  iconType: string;
  title: string;
  amount: string;
};

export default function Card({ iconType, title, amount }: Props) {
  return (
    <div className={styles.container}>
      {iconType === "users" && <LuUsers size={24} />}
      {iconType === "deposits" && <LuBadgePlus size={24} />}
      {iconType === "treasury" && <LuPiggyBank size={24} />}

      <div className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <span className={styles.number}>{amount}</span>
        <span className={styles.detail}>
          {/* <span className={styles.positive}>{changes}</span> */}
        </span>
      </div>
    </div>
  );
}
