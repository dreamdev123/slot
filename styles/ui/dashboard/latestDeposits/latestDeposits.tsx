import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { IDeposit } from "../../../../models/depositsSchema";

import { fetchDeposits } from "../../../../data/depositData";
import { formatMoney } from "../../../../utils/formatMoney";

import styles from "../../../latestDeposits.module.css";

type LatestDepositsProps = {
  searchParams: {
    q?: string;
    page?: number;
  };
};

export default function LatestDeposits({ searchParams }: LatestDepositsProps) {
  const [deposits, setDeposits] = useState<IDeposit[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  useEffect(() => {
    async function loadDeposits() {
      try {
        const { count, deposits } = await fetchDeposits(q, page);
        setDeposits(deposits);
        setCount(count);
      } catch (err) {
        setError("Failed to fetch deposits.");
      } finally {
        setLoading(false);
      }
    }

    loadDeposits();
  }, [q, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Deposits</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Amount</td>
            <td>Transaction Status</td>
            <td>Transaction Address</td>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id}>
              <td>
                <div className={styles.user}>
                  <Image
                    src={deposit.pfpUrl}
                    alt={deposit.username}
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {deposit.username}
                </div>
              </td>
              <td>${deposit.amount}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    deposit.transactionStatus ? styles.success : styles.failed
                  }`}
                >
                  {deposit.transactionStatus ? "Success" : "Failed"}
                </span>
              </td>
              <td className={styles.link}>
                <Link
                  href={`https://etherscan.io/tx/${deposit.transactionAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check transaction
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
