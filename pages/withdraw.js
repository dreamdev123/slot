import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ethers } from "ethers";

import { fetchLatestUserData, updateUser } from "../data/userData";
import { fetchLatestTreasuryData, updateTreasury } from "../data/treasuryData";
import convertUsdToEth from "../utils/convertUsdToEth";

import styles from "../styles/Withdraw.module.css";
import Popup from "../components/popup";

export default function Withdraw() {
  const { data: session, status } = useSession();
  const [customAmount, setCustomAmount] = useState("");
  const [userData, setUserData] = useState();
  const [treasuryData, setTreasuryData] = useState();
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      console.log("Session and user available, fetching data");
      userResponse();
      treasuryResponse();
    }
  }, [session]);

  const userResponse = async () => {
    try {
      console.log("Fetching user data");
      const fetchedUserData = await fetchLatestUserData(session);
      console.log("User data fetched:", fetchedUserData);
      setUserData(fetchedUserData);
    } catch (error) {
      console.error("Error fetching latest user data:", error);
      setError("Failed to fetch user data.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const treasuryResponse = async () => {
    try {
      console.log("Fetching treasury data");
      const fetchedTreasuryData = await fetchLatestTreasuryData(
        "0x6BAe2A85789A6e5a87b3422c366e6c7828922CFE"
      );
      console.log("Treasury data fetched:", fetchedTreasuryData);
      setTreasuryData(fetchedTreasuryData);
    } catch (error) {
      console.error("Error fetching latest treasury data:", error);
      setError("Failed to fetch treasury data.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
  };

  const handleWithdraw = async (usdAmount) => {
    try {
      const parsedUsdAmount = parseFloat(usdAmount);

      const minWithdrawAmount = 5; // in USD

      if (isNaN(parsedUsdAmount) || parsedUsdAmount <= 0) {
        setError("Please enter a valid amount");
        setPopupType("error");
        setShowPopup(true);
        return;
      }

      if (parsedUsdAmount < minWithdrawAmount) {
        setError(`Minimum withdrawal amount is $${minWithdrawAmount}`);
        setPopupType("error");
        setShowPopup(true);
        return;
      }

      if (!userData || !userData.walletAddress) {
        throw new Error("User data or wallet address is missing");
      }

      if (userData.currentBalance < parsedUsdAmount) {
        setError("Insufficient funds");
        setPopupType("error");
        setShowPopup(true);
        return;
      }

      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      // Critical check to prevent empty transactions
      if (userData.currentBalance >= parsedUsdAmount) {
        setIsBalanceSufficient(true);
        console.log("Withdraw initiated with amount:", parsedUsdAmount);
        const ethAmount = await convertUsdToEth(parsedUsdAmount);
        console.log("Converted to ETH:", ethAmount);
        const amount = ethers.utils.parseEther(`${ethAmount}`);

        const response = await fetch("/api/withdraw/tx/withdraw-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount.toString(),
            walletAddress: userData.walletAddress,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Withdrawal failed");
        }

        const data = await response.json();
        const transactionHash = data.transactionHash;

        if (transactionHash) {
          console.log(transactionHash);
          const withdrawalResponse = await fetch("/api/withdraw/route", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: userData.username,
              pfpUrl: userData.pfpUrl,
              walletAddress: userData.walletAddress,
              amount: parsedUsdAmount,
              transactionAddress: transactionHash,
              transactionStatus: true,
            }),
          });

          if (!withdrawalResponse.ok) {
            throw new Error("Failed to create a withdrawal");
          }
          console.log("Withdrawal successful");
          userData.currentBalance -= usdAmount;
          treasuryData.treasuryAmount -= usdAmount;
          await updateUser(userData);
          await updateTreasury(treasuryData);
          setSuccessMessage(`Successfully withdrew $${parsedUsdAmount}`);
          setPopupType("success");
          setShowPopup(true);
        } else {
          throw new Error("Transaction hash is missing");
        }
      } else {
        throw new Error("Insufficient funds");
      }
    } catch (error) {
      console.error("Error when attempting to withdraw funds:", error);
      setError(error.message || "Withdrawal failed");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setIsLoading(false);
      setTransactionStatus(false);
      setCustomAmount("");
      setIsBalanceSufficient(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Withdraw - Nite Slot</title>
      </Head>

      {showPopup && (
        <Popup
          type={popupType}
          message={popupType === "error" ? error : successMessage}
          onClose={handleClosePopup}
        />
      )}

      <main className={styles.main}>
        <a href="/bank">
          <div className={styles.exit}>
            <Image
              src="/sprites/but_exit.png"
              alt="Exit"
              width={50}
              height={50}
            />
          </div>
        </a>
        <div className={styles.grid}>
          <div className={styles.column}>
            <a href="/">
              <Image
                src="/sprites/but_home.png"
                alt="Nite Slot"
                width={400}
                height={500}
              />
            </a>
          </div>
          <div className={styles.column}>
            <div className={styles.card}>
              <div className={styles.amounts}>
                {[10, 30, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    className={styles.amountButton}
                    onClick={() => handleWithdraw(amount)}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                className={styles.customAmount}
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Custom amount"
                min="5"
                step="0.01"
              />
              <button
                className={styles.withdrawButton}
                onClick={() => handleWithdraw(Number(customAmount))}
                disabled={isLoading}
              >
                <Image
                  src="/sprites/but_coin_bg.png"
                  alt="Withdraw"
                  width={200}
                  height={50}
                />
                <span className={styles.withdrawLabel}>
                  {isLoading ? "Processing..." : "Withdraw"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
