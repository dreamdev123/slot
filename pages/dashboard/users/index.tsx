import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { IUser } from "../../../models/userSchema";

import { fetchUsers } from "../../../data/userData";
import { formatDate } from "../../../utils/formatDate";
import { formatMoney } from "../../../utils/formatMoney";

import styles from "../../../styles/users.module.css";
import Search from "../../../styles/search.module.css";
import Pagination from "../../../styles/ui/dashboard/pagination/pagination";

export default function UsersPage({ searchParams }: any) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  useEffect(() => {
    async function fetchUsersData() {
      try {
        const { count, users } = await fetchUsers(q, page);
        setUsers(users);
        setCount(count);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsersData();
  }, [q, page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {/* <Search /> */}
        {/* <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link> */}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Address</td>
            <td>Spins won</td>
            <td>Total spins</td>
            <td>Current balance</td>
            <td>Total deposits</td>
            {/* <td>Created At</td> */}
            <td>Admin</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.user}>
                  <Image
                    src={user.pfpUrl || "/sprites/logo.png"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {user.username}
                </div>
              </td>
              <td>{user.walletAddress}</td>
              <td>{user.spinsWon}</td>
              <td>{user.totalSpins}</td>
              <td>{`$${user.currentBalance}`}</td>
              <td>{user.totalDeposits}</td>
              {/* <td>{formatDate(user.createdAt)}</td> */}
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              {/* <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/users/${user.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form>
                    <button className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Pagination count={count} /> */}
    </div>
  );
}
