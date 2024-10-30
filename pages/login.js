"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import styles from "../styles/Login.module.css";

export default function Login() {
  const router = useRouter();
  //Wallet auth
  const [loggedIn, setLoggedIn] = useState(false);

  //Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //SignUp form
  const [signUpEmail, setSignUpEmail] = useState("");
  const [username, setUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError("Invalid email or password");
    } else {
      router.push("/profile");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signUpEmail,
          username: username,
          password: signUpPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = await signIn("credentials", {
          redirect: false,
          email: signUpEmail,
          password: signUpPassword,
        });

        if (result.error) {
          setSignupError("Error signing in after signup");
        } else {
          router.push("/profile");
        }
      } else {
        setSignupError(data.message || "Error creating user");
      }
    } catch (error) {
      setSignupError("An error occurred during signup");
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
        <div className={styles.homeButton}>
          <Image src="/sprites/but_home.png" height={460} width={350} />
        </div>

        <div className={styles.card}>
          <h2>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.input}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name="password"
              />
            </div>
            <button type="submit" className={styles.actionButton}>
              <Image
                src="/sprites/but_coin_bg.png"
                width={150}
                height={50}
                alt="Login"
              />
              <span>Login</span>
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <h2>Sign Up</h2>
          {signupError && <p className={styles.error}>{signupError}</p>}
          <form onSubmit={handleSignup}>
            <div className={styles.input}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter an email address"
                onChange={(e) => setSignUpEmail(e.target.value)}
                value={signUpEmail}
                name="email"
              />
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter a username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                name="username"
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter a password"
                onChange={(e) => setSignUpPassword(e.target.value)}
                value={signUpPassword}
                name="password"
              />
            </div>
            <button className={styles.actionButton}>
              <Image
                src="/sprites/but_coin_bg.png"
                width={150}
                height={50}
                alt="Sign Up"
              />
              <span>Sign Up</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
