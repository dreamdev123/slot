import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { ITreasury } from "../../../models/treasurySchema";

import { fetchLatestTreasuryData } from "../../../data/treasuryData";

import styles from "../../../styles/treasury.module.css";

export default function TreasuryPage({ searchParams }: any) {
  const [treasury, setTreasury] = useState<ITreasury | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTreasuryData() {
      try {
        const data = await fetchLatestTreasuryData(
          "0x6BAe2A85789A6e5a87b3422c366e6c7828922CFE"
        );
        setTreasury(data);
      } catch (err) {
        setError("Failed to fetch treasury.");
      } finally {
        setLoading(false);
      }
    }

    fetchTreasuryData();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!treasury) return <div>No treasury data found.</div>;

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Owner</td>
            <td>Treasury Address</td>
            <td>Treasury Amount</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.user}>
                <Image
                  src={"/sprites/logo.png"}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
                Nite Slot
              </div>
            </td>
            <td>{treasury.treasuryAddress || "N/A"}</td>
            <td>${treasury.treasuryAmount || "0"}</td>
            <td>
              <div className={styles.buttons}>
                {/* <Link href={`/dashboard/treasury/${treasury.treasuryAddress}`}>
                  <button className={`${styles.button} ${styles.view}`}>
                    Update
                  </button>
                </Link> */}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        *Please use an address that will be used solely for this game.
        Differences in amounts can be due to gas fees and market fluctuations.
      </p>
    </div>
  );
}

// export default TreasuryPage;
