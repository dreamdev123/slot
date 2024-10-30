"use client";
import { useState, useEffect } from "react";

import type { NextPage } from "next";
import Image from "next/image";

import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";

import { client } from "../../lib/client";

import LoginButton from "./components/login-button";

import styles from "../../styles/Login.module.css";
import { login } from "../../lib/auth2";

const LoginPage: NextPage = () => {
  const [error, setError] = useState<string | null>(null);

  const niteTheme = darkTheme({
    colors: {
      primaryButtonBg: "transparent",
    },
  });

  const handleLogin = async (payload) => {
    try {
      await login(payload);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className={styles.container}>
      <Image
        src="/sprites/bg_game.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
        alt="Background"
      />
      <div className={styles.exitButton}>
        <a href={"/"}>
          <Image
            src="/sprites/but_exit.png"
            width={50}
            height={50}
            alt="Exit"
          />
        </a>
      </div>
      <div className={styles.content}>
        {/* <div className={styles.homeButton}>
          <Image
            src="/sprites/but_home.png"
            height={460}
            width={350}
            alt="Home"
          />
        </div> */}

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2>Login</h2>
            <div>
              <h3>Step 1</h3>
              <p>Connect to your wallet</p>
              <div className={styles.customConnectButtonWrapper}>
                <ConnectButton client={client} theme={niteTheme} />
              </div>
              <h3>Step 2</h3>
              <p>Sign the app in your wallet</p>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
