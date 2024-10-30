"use client";
import { useState, useEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

import { fetchLatestUserData } from "../data/userData";

import styles from "../styles/Bank.module.css";

export default function Bank() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await fetchLatestUserData(session);
      setBalance(userData);
    } catch (error) {
      console.error("Error fetching current balance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Bank - Nite Slot</title>
      </Head>

      <div className={styles.logoutButton} onClick={handleLogout}>
        <Image
          src="/sprites/but_logout.png"
          alt="Logout"
          width={50}
          height={50}
        />
      </div>

      <div className={styles.container}>
        <main className={styles.main}>
          {isLoading ? (
            <div className={styles.balance}>Loading...</div>
          ) : (
            <div className={styles.balance}>
              Balance: ${balance.currentBalance.toFixed(2)}
            </div>
          )}
          {/* Remove the duplicate balance display */}
          <div className={styles.content}>
            <a href="/">
              <div className={styles.card}>
                <Image
                  src="/sprites/but_home.png"
                  alt="Home"
                  width={200}
                  height={200}
                />
                <p>Menu</p>
              </div>
            </a>
            <a href="/profile">
              <div className={styles.card}>
                <Image
                  src="/sprites/but_card_profile.png"
                  alt="Profile"
                  width={200}
                  height={200}
                />
                <p>Profile</p>
              </div>
            </a>
            <a href="/deposit">
              <div className={styles.card}>
                <Image
                  src="/sprites/but_deposit.png"
                  alt="Deposit"
                  width={200}
                  height={200}
                />
                <p>Deposit</p>
              </div>
            </a>
            <a href="/withdraw">
              <div className={styles.card}>
                <Image
                  src="/sprites/but_withdraw.png"
                  alt="Withdraw"
                  width={200}
                  height={200}
                />
                <p>Withdraw</p>
              </div>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
