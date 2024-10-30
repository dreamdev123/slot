export const getDeposits = async () => {
  try {
    const response = await fetch("/api/deposit/route", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.deposits;
  } catch (error) {
    console.error("Error fetching latest deposit data:", error);
    throw error;
  }
};

export const fetchDeposits = async (q: string, page: number) => {
  try {
    const response = await fetch("/api/deposit/fetch/route", {
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
    throw new Error("Failed to fetch deposits!");
  }
};
