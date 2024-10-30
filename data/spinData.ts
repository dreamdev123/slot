export const getSpins = async () => {
  try {
    const response = await fetch("api/spin/route", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching latest spin data:", error);
    throw error;
  }
};

export const fetchSpins = async (q: string, page: number) => {
  try {
    const response = await fetch("/api/spin/fetch/route", {
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
    throw new Error("Failed to fetch spins!");
  }
};
