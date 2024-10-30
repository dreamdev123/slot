import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import connectMongo from "../../../config/database";
import Withdraw from "../../../models/withdrawSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const {
        username,
        pfpUrl,
        walletAddress,
        amount,
        transactionAddress,
        transactionStatus,
      } = req.body;

      if (!transactionAddress) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: "One or more parameters missing in the request body",
        });
      }

      const withdraw = await Withdraw.create({
        username,
        pfpUrl,
        walletAddress,
        amount,
        transactionAddress,
        transactionStatus,
      });

      res.status(HttpStatusCode.Created).json({
        withdraw,
        message: "Withdraw has been created successfully",
      });
    } catch (error) {
      console.error("Error creating withdraw:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while creating the withdraw",
      });
    }
  } else if (req.method === "GET") {
    try {
      const withdraw = await Withdraw.find({})
        .select("-password")
        .sort({ createdAt: -1 });
      const count = await Withdraw.countDocuments({});

      res.status(HttpStatusCode.Ok).json({
        count,
        withdraw,
        message: "Withdrawals retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while fetching withdrawals",
      });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .end(`Method ${req.method} Not Allowed`);
  }
}
