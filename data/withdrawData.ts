export const fetchWithdrawals = async (q: string, page: number) => {
  try {
    const response = await fetch("/api/withdraw/fetch/route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q, page }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch withdrawals!");
  }
};
