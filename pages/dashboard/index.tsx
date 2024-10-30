"use client";

import { useState, useEffect } from "react";

import { getDeposits } from "../../data/depositData";
import { fetchLatestTreasuryData } from "../../data/treasuryData";
import { getUsers } from "../../data/userData";
import { formatMoney } from "../../utils/formatMoney";

// import Rightbar from "../ui/dashboard/rightbar/rightbar";
import LatestDeposits from "../../styles/ui/dashboard/latestDeposits/latestDeposits";
import LatestWithdrawals from "../../styles/ui/dashboard/latestWithdrawals/latestWithdrawals";
// import Chart from "../ui/dashboard/chart/chart";
import Card from "../../styles/ui/dashboard/card/card";

import styles from "../../styles/dashboard.module.css";

function UserDataFetcher() {
  const [userData, setUserData] = useState<{ totalUsers: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then((data) => {
        if (data && typeof data.totalUsers === "number") {
          setUserData(data);
        } else {
          throw new Error("Invalid user data format");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Error fetching user data");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card
      iconType="users"
      title="Total users"
      amount={userData?.totalUsers.toString() ?? "0"}
    />
  );
}

function DepositDataFetcher() {
  const [depositData, setDepositData] = useState<{
    formattedTotalDeposits: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDeposits()
      .then(async (deposits) => {
        const totalDeposits = deposits.reduce(
          (sum: number, deposit: any) => sum + deposit.amount,
          0
        );
        const formattedTotalDeposits = (
          await formatMoney(totalDeposits)
        ).toString();
        setDepositData({ formattedTotalDeposits });
        setIsLoading(false);
      })
      .catch(() => {
        setError("Error fetching deposit data");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card
      iconType={"deposits"}
      title={"Deposits value"}
      amount={`$${depositData?.formattedTotalDeposits || "0"}`}
    />
  );
}

function TreasuryDataFetcher() {
  const [treasuryData, setTreasuryData] = useState<{
    treasuryAmount: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestTreasuryData("0x6BAe2A85789A6e5a87b3422c366e6c7828922CFE")
      .then((treasury) => {
        setTreasuryData({ treasuryAmount: treasury.treasuryAmount });
        setIsLoading(false);
      })
      .catch(() => {
        setError("Error fetching treasury data");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card
      iconType={"treasury"}
      title={"Treasury value"}
      amount={`$${treasuryData?.treasuryAmount}`}
    />
  );
}

// Main Dashboard component (no longer async)
export default function Dashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <UserDataFetcher />
          <DepositDataFetcher />
          <TreasuryDataFetcher />
        </div>
        <LatestDeposits searchParams={{}} />
        <LatestWithdrawals searchParams={{}} />
        {/* <Chart /> */}
      </div>
      <div className={styles.side}>{/* <Rightbar /> */}</div>
    </div>
  );
}
