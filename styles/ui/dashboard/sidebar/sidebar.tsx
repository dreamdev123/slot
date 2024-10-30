import React from "react";
import Image from "next/image";

import MenuLink from "./menuLink/menuLink";

import {
  LuLayoutDashboard,
  LuUsers2,
  LuDices,
  LuPiggyBank,
  LuBadgePlus,
  LuGem,
  LuBadgeDollarSign,
  LuBarChart3,
  LuSettings,
  LuBadgeHelp,
  LuLogOut,
  LuBuilding,
} from "react-icons/lu";

import styles from "../../../sidebar.module.css";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LuLayoutDashboard />,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <LuUsers2 />,
      },
      {
        title: "Spins",
        path: "/dashboard/spins",
        icon: <LuDices />,
      },
      {
        title: "Deposits",
        path: "/dashboard/deposits",
        icon: <LuBadgePlus />,
      },
      {
        title: "Withdrawals",
        path: "/dashboard/withdrawals",
        icon: <LuGem />,
      },
      {
        title: "Treasury",
        path: "/dashboard/treasury",
        icon: <LuPiggyBank />,
      },
    ],
  },
  // {
  //   title: "Analytics",
  //   list: [
  //     {
  //       title: "Revenue",
  //       path: "/dashboard/revenue",
  //       icon: <LuBadgeDollarSign />,
  //     },
  //     {
  //       title: "Reports",
  //       path: "/dashboard/reports",
  //       icon: <LuBarChart3 />,
  //     },
  //   ],
  // },
  // {
  //   title: "Admin",
  //   list: [
  //     {
  //       title: "Game settings",
  //       path: "/dashboard/settings",
  //       icon: <LuSettings />,
  //     },
  //     {
  //       title: "Help",
  //       path: "/dashboard/help",
  //       icon: <LuBadgeHelp />,
  //     },
  //   ],
  // },
];

export default function Sidebar() {
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src="/sprites/logo.png"
          alt="user"
          width="50"
          height="50"
        />

        <div className={styles.userDetail}>
          <span className={styles.userName}>Nite Slot</span>
          <span className={styles.userTitle}>Admin</span>
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      {/* <button className={styles.logout}>
        <LuLogOut />
        Logout
      </button> */}
    </div>
  );
}
