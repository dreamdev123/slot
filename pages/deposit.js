"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ethers } from "ethers";

import { fetchLatestUserData, updateUser } from "../data/userData";
import { fetchLatestTreasuryData, updateTreasury } from "../data/treasuryData";
import convertUsdToEth from "../utils/convertUsdToEth";

import styles from "../styles/Deposit.module.css";
import Popup from "../components/popup";

export default function Deposit() {
  const { data: session, status } = useSession();
  const [customAmount, setCustomAmount] = useState("");
  const [userData, setUserData] = useState();
  const [treasuryData, setTreasuryData] = useState();
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [signer, setSigner] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");

  const SEPOLIA_CHAIN_ID = 11155111;

  useEffect(() => {
    if (session && session.user) {
      console.log("Session and user available, fetching data");
      userResponse();
      treasuryResponse();
      initializeSigner();
    }
  }, [session]);

  const initializeSigner = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        if (network.chainId !== SEPOLIA_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: ethers.utils.hexlify(SEPOLIA_CHAIN_ID) }],
            });
            console.log("Switched to the Sepolia Testnet");
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: ethers.utils.hexlify(SEPOLIA_CHAIN_ID),
                      chainName: "Ethereum Sepolia Testnet",
                      rpcUrls: [
                        `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
                      ],
                      nativeCurrency: {
                        name: "Ether",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://sepolia.etherscan.io"],
                    },
                  ],
                });
                console.log("Sepolia Testnet added and switched");
              } catch (addError) {
                console.error("Failed to add the Sepolia Testnet", addError);
                setError(
                  "Please switch your wallet to the Ethereum Sepolia Testnet."
                );
                setPopupType("error");
                setShowPopup(true);
                return;
              }
            } else {
              console.error(
                "Failed to switch to the Sepolia Testnet",
                switchError
              );
              setError(
                "Please switch your wallet to the Ethereum Sepolia Testnet."
              );
              setPopupType("error");
              setShowPopup(true);
              return;
            }
          }
        }

        const signerInstance = provider.getSigner();
        setSigner(signerInstance);
      } catch (err) {
        console.error("User denied account access or network switch", err);
        setError(
          "Please allow access to your wallet and switch to the Ethereum Sepolia Testnet."
        );
        setPopupType("error");
        setShowPopup(true);
      }
    } else {
      console.error("No Ethereum provider found");
      setError("Please install MetaMask or another Ethereum wallet.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const userResponse = async () => {
    try {
      console.log("Fetching user data");
      const fetchedUserData = await fetchLatestUserData(session);
      console.log("User data fetched:", fetchedUserData);
      setUserData(fetchedUserData);
      setWalletAddress(fetchedUserData.walletAddress);
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

  const handleDeposit = async (usdAmount) => {
    try {
      if (!usdAmount || isNaN(usdAmount)) {
        setError("Please enter an amount");
        setPopupType("error");
        setShowPopup(true);
        return;
      }

      if (!walletAddress || !signer) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const ethAmount = await convertUsdToEth(Number(usdAmount));
      const treasuryAddress = "0x6BAe2A85789A6e5a87b3422c366e6c7828922CFE";

      // Create the transaction using ethers.js
      const tx = await signer.sendTransaction({
        to: treasuryAddress,
        value: ethers.utils.parseEther(ethAmount.toString()),
      });

      await tx.wait();

      if (tx) {
        setTransactionStatus(true);
        const transactionHash = tx.hash;
        const depositResponse = await fetch("/api/deposit/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
            pfpUrl: userData.pfpUrl,
            walletAddress: userData.walletAddress,
            amount: usdAmount,
            transactionAddress: transactionHash,
            transactionStatus: true,
          }),
        });

        if (!depositResponse.ok) {
          throw new Error("Failed to create a deposit");
        }

        userData.currentBalance = Number(
          (Number(userData.currentBalance) + Number(usdAmount)).toFixed(2)
        );
        userData.totalDeposits += 1;
        treasuryData.treasuryAmount = Number(
          (Number(treasuryData.treasuryAmount) + Number(usdAmount)).toFixed(2)
        );

        console.log("Updating user data:", userData);
        await updateUser(userData);

        console.log("Updating treasury data:", treasuryData);
        await updateTreasury(treasuryData);

        console.log("Deposit successful");
        setSuccessMessage(`Successfully deposited $${usdAmount}`);
        setPopupType("success");
        setShowPopup(true);
      }
      setTransactionStatus(false);
      setCustomAmount("");
    } catch (error) {
      console.error("Error during deposit:", error);
      setError("Deposit failed");
      setPopupType("error");
      setShowPopup(true);
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
      setTransactionStatus(false);
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
        <title>Deposit - Nite Slot</title>
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
                    onClick={() => handleDeposit(amount)}
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
              />
              {walletAddress ? (
                <button
                  className={styles.depositButton}
                  onClick={() => handleDeposit(customAmount)}
                  disabled={isLoading}
                >
                  <Image
                    src="/sprites/but_coin_bg.png"
                    alt="Deposit"
                    width={200}
                    height={50}
                  />
                  <span className={styles.depositLabel}>
                    {isLoading ? "Processing..." : "Deposit"}
                  </span>
                </button>
              ) : (
                <button
                  className={styles.connectButton}
                  onClick={initializeSigner}
                  disabled={isLoading}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
