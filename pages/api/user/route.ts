import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import connectMongo from "../../../config/database";
import User from "../../../models/userSchema";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const userData = req.body;
      const requiredFields = ["walletAddress", "username", "email"];
      for (const field of requiredFields) {
        if (!userData[field]) {
          return res.status(400).json({ message: `Missing ${field}` });
        }
      }
      if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 10);
      }

      if (!userData) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: "User data is required",
        });
      }

      const user = await User.create({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        pfpUrl: userData.pfpUrl,
        currentBalance: userData.currentBalance,
        spinsWon: userData.spinsWon,
        totalSpins: userData.totalSpins,
        totalEarnings: userData.totalEarnings,
        totalDeposits: userData.totalDeposits,
        walletAddress: userData.walletAddress,
        isAdmin: userData.isAdmin,
      });

      res.status(HttpStatusCode.Created).json({
        user,
        message: "User has been created successfully",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while creating the user",
      });
    }
  } else if (req.method === "GET") {
    try {
      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });
      const count = await User.countDocuments({});

      res.status(HttpStatusCode.Ok).json({
        count,
        users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while fetching users",
      });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .end(`Method ${req.method} Not Allowed`);
  }
}
