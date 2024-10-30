import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { IDeposit } from "../../../models/depositsSchema";

import { fetchDeposits } from "../../../data/depositData";
import { formatMoney } from "../../../utils/formatMoney";
import { formatDate } from "../../../utils/formatDate";

import styles from "../../../styles/deposits.module.css";
import Search from "../../../styles/ui/dashboard/search/search";
import Pagination from "../../../styles/ui/dashboard/pagination/pagination";

export default function DepositsPage({ searchParams }: any) {
  const [deposits, setDeposits] = useState<IDeposit[]>([]);
  const [count, setCount] = useState<number>(0);
  const [q, setQ] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        setLoading(true);
        const data = await fetchDeposits(q, page);
        setDeposits(data.deposits);
        setCount(data.count);
      } catch (err) {
        setError("Failed to fetch deposits.");
      } finally {
        setLoading(false);
      }
    };

    loadDeposits();
  }, [q, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>User Address</th>
            <th>Amount</th>
            <th>Transaction Address</th>
            <th>Transaction Status</th>
            <th>Created At</th>
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
              <td>{deposit.walletAddress}</td>
              <td>${formatMoney(deposit.amount)}</td>
              <td className={styles.link}>
                <Link
                  href={`https://etherscan.io/tx/${deposit.transactionAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check transaction
                </Link>
              </td>
              <td>{deposit.transactionStatus ? "Success" : "Failed"}</td>
              <td>{formatDate(deposit.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}
