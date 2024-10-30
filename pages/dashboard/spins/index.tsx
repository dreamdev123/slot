import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ISpin } from "../../../models/spinSchema";

import { fetchSpins } from "../../../data/spinData";
import { formatMoney } from "../../../utils/formatMoney";
import { formatDate } from "../../../utils/formatDate";

import styles from "../../../styles/spins.module.css";
import Search from "@/styles/search.module.css";
import Pagination from "../../../styles/ui/dashboard/pagination/pagination";

export default function SpinsPage({ searchParams }: any) {
  const [spins, setSpins] = useState<ISpin[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  useEffect(() => {
    async function fetchSpinsData() {
      try {
        const { count, spins } = await fetchSpins(q, page);
        setSpins(spins);
        setCount(count);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    }

    fetchSpinsData();
  }, [q, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.top}>{/* <Search /> */}</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Spin price</th>
            <th>Outcome</th>
            <th>Money earned</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {spins.map((spin) => (
            <tr>
              <td>
                <div className={styles.user}>
                  <Image
                    src={spin.pfpUrl}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {spin.username}
                </div>
              </td>
              <td>${spin.spinPrice}</td>
              <td>{spin.outcome ? "Won" : "Lost"}</td>
              <td>${formatMoney(spin.moneyEarned)}</td>
              <td>{formatDate(spin.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}
