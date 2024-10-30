"use client";
import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useActiveAccount } from "thirdweb/react";
import { signLoginPayload } from "thirdweb/auth";

import { generatePayload, login } from "../../../lib/auth2";

import Popup from "../../../components/popup";

import styles from "../../../styles/Login.module.css";

export default function LoginButton() {
  const account = useActiveAccount();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  async function handleClick() {
    if (!account) {
      return alert("Please connect your wallet");
    }
    try {
      setShowPopup(true);
      // Step 1: Generate the payload
      const payload = await generatePayload({ address: account.address });
      // Step 2: Sign the payload
      const signatureResult = await signLoginPayload({ account, payload });
      // Step 3: Call the login function
      const result = await login(signatureResult);

      if (result.success) {
        router.push("/");
      } else {
        console.error("Login failed");
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setShowPopup(false);
    }
  }

  return (
    <>
      <button
        className={styles.actionButton}
        disabled={!account}
        onClick={handleClick}
      >
        <Image
          src="/sprites/but_coin_bg.png"
          width={300}
          height={100}
          alt="Login"
        />
        <span>Proceed</span>
      </button>
      {showPopup && (
        <Popup
          type="success"
          message="Approve the sign-in request in your wallet"
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
