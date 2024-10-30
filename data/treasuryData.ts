export const fetchLatestTreasuryData = async (treasuryAddress: string) => {
  try {
    const response = await fetch(
      `/api/treasury/treasuryAddress/${treasuryAddress}/route`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching latest treasury data:", error);
    throw error;
  }
};

export const getTreasuryById = async (treasury_id: string) => {
  try {
    const response = await fetch(`/api/treasury/${treasury_id}/route`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching treasury by id:", error);
    throw error;
  }
};

export const updateTreasury = async (treasury: any) => {
  try {
    const updatedTreasury = {
      ...treasury,
      treasuryAmount: Number(Number(treasury.treasuryAmount).toFixed(2)),
    };

    const response = await fetch(`/api/treasury/${treasury._id}/route`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTreasury),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating treasury data:", error);
    throw error;
  }
};
