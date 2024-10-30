import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { IWithdraw } from "../../../../models/withdrawSchema";

import { fetchWithdrawals } from "../../../../data/withdrawData";
import { formatDate } from "../../../../utils/formatDate";

import styles from "../../../latestWithdrawals.module.css";

type LatestWithdrawalsProps = {
  searchParams: {
    q?: string;
    page?: number;
  };
};

export default function LatestWithdrawals({
  searchParams,
}: LatestWithdrawalsProps) {
  const [withdrawals, setWithdrawals] = useState<IWithdraw[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  useEffect(() => {
    async function loadWithdrawals() {
      try {
        const { count, withdrawals } = await fetchWithdrawals(q, page);
        setWithdrawals(withdrawals);
        setCount(count);
      } catch (err) {
        setError("Failed to fetch withdrawals.");
      } finally {
        setLoading(false);
      }
    }

    loadWithdrawals();
  }, [q, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Withdrawals</h2>
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
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.id}>
              <td>
                <div className={styles.user}>
                  <Image
                    src={withdrawal.pfpUrl}
                    alt={withdrawal.username}
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {withdrawal.username}
                </div>
              </td>
              <td>${withdrawal.amount}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    withdrawal.transactionStatus
                      ? styles.success
                      : styles.failed
                  }`}
                >
                  {withdrawal.transactionStatus ? "Success" : "Failed"}
                </span>
              </td>

              <td className={styles.link}>
                <Link
                  href={`https://etherscan.io/tx/${withdrawal.transactionAddress}`}
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
