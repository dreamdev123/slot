import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { IWithdraw } from "../../../models/withdrawSchema";

import { fetchWithdrawals } from "../../../data/withdrawData";
import { formatDate } from "../../../utils/formatDate";

import styles from "../../../styles/deposits.module.css";
import Search from "../../../styles/ui/dashboard/search/search";
import Pagination from "../../../styles/ui/dashboard/pagination/pagination";

export default function WithdrawlsPage({ searchParams }: any) {
  const [withdrawals, setWithdrawals] = useState<IWithdraw[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  useEffect(() => {
    async function fetchWithdrawalsData() {
      try {
        const { count, withdrawals } = await fetchWithdrawals(q, page);
        setWithdrawals(withdrawals || []);
        setCount(count);
      } catch (err) {
        setError("Failed to fetch withdrawals.");
      } finally {
        setLoading(false);
      }
    }

    fetchWithdrawalsData();
  }, [q, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.top}>{/* <Search /> */}</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Wallet Address</td>
            <td>Amount</td>
            <td>Transaction Address</td>
            <td>Transaction Status</td>
            {/* <td>Created At</td> */}
          </tr>
        </thead>
        <tbody>
          {withdrawals.length > 0 ? (
            withdrawals.map((withdrawal) => (
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
                <td>{withdrawal.walletAddress}</td>
                <td>${withdrawal.amount}</td>
                <td className={styles.link}>
                  <Link
                    href={`https://etherscan.io/tx/${withdrawal.transactionAddress}`}
                    target="blank"
                  >
                    Check transaction
                  </Link>
                </td>
                <td>{withdrawal.transactionStatus ? "Success" : "Failed"}</td>
                {/* <td>{formatDate(withdrawal.createdAt)}</td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No withdrawals found</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* <Pagination count={count} /> */}
    </div>
  );
}
