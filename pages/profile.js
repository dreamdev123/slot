import { useState, useEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { logout } from "../lib/auth2";
import { useSession, signOut } from "next-auth/react";
import { formatMoney } from "../utils/formatMoney";
import styles from "../styles/Profile.module.css";
import { redirect } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (session && session.user) {
      setProfile({
        username: session.user.username,
        spinsWon: session.user.spinsWon,
        totalSpins: session.user.totalSpins,
        totalEarnings: session.user.totalEarnings,
        moneyDeposited: session.user.totalDeposits,
      });
    }
  }, [session]);

  const handleExit = () => {
    window.location.href = "/";
  };

  const handleLogout = async () => {
    await logout();
    await signOut();
    window.location.href = "/login2";
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // if (!session) {
  //   return <div>Please sign in to view your profile.</div>;
  // }

  return (
    <div className={styles.container}>
      <Head>
        <title>Profile - Nite Slot</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.buttonContainer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <Image
              src="/sprites/but_logout.png"
              alt="Logout"
              width={50}
              height={50}
            />
          </button>
          <button className={styles.exitButton} onClick={handleExit}>
            <Image
              src="/sprites/but_exit.png"
              alt="Exit"
              width={50}
              height={50}
            />
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <Link href={"/"}>
              <Image
                src="/sprites/but_home.png"
                alt="Home"
                width={400}
                height={500}
              />
            </Link>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                {profile && (
                  <>
                    <h2>Welcome, {profile.username}!</h2>
                    <p>Spins Won: {profile.spinsWon}</p>
                    <p>Total Spins: {profile.totalSpins}</p>
                    <p>Total Earnings: ${formatMoney(profile.totalEarnings)}</p>
                    <p>
                      Money Deposited: ${formatMoney(profile.moneyDeposited)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
