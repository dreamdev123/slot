import { IUser } from "../models/userSchema";

export const createUser = async (userData: Partial<IUser>) => {
  try {
    const response = await fetch("/api/user/route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), // Send the user data in the request body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.user; // Assuming API returns { message: "...", user: {...} }
  } catch (error) {
    console.error("Error creating the user: ", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch("/api/user/route", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { totalUsers: data.count }; // Return an object with totalUsers
  } catch (error) {
    console.error("Error fetching latest user data:", error);
    throw error;
  }
};

export const loginWalletUser = async (walletAddress: string) => {
  try {
    const response = await fetch(
      `/api/user/walletAddress/${walletAddress}/route`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      return null; // User not found
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.user; // Assuming API returns { message: "...", user: {...} }
  } catch (error) {
    console.error("Error fetching user's wallet address", error);
    throw error;
  }
};

export const fetchLatestUserData = async (session: any) => {
  try {
    const response = await fetch(`/api/user/${session.user.id}/route`, {
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
    console.error("Error fetching latest user data:", error);
    throw error;
  }
};
//for dashboard
export const fetchUsers = async (q: string, page: number) => {
  try {
    const response = await fetch("/api/user/fetch/route", {
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
    throw new Error("Failed to fetch users!");
  }
};

export const updateUser = async (user: any) => {
  try {
    const updatedUser = {
      ...user,
      currentBalance: Number(Number(user.currentBalance).toFixed(2)),
    };

    const response = await fetch(`/api/user/${user._id}/route`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};
