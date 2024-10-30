import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import connectMongo from "../../../config/database";
import Deposit from "../../../models/depositsSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();
  if (req.method === "GET") {
    try {
      const deposits = await Deposit.find().sort({ createdAt: -1 });
      const count = await Deposit.countDocuments({});
      return res
        .status(HttpStatusCode.Ok)
        .json({ count, deposits, message: "Deposits retrieved successfully" });
    } catch (error) {
      console.error("Error fetching deposits:", error);
      return res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while fetching deposits",
      });
    }
  }

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

      if (!username || !transactionAddress) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: "One or more parameters missing in the request body",
        });
      }

      const deposit = await Deposit.create({
        username,
        pfpUrl,
        walletAddress,
        amount,
        transactionAddress,
        transactionStatus,
      });

      return res.status(HttpStatusCode.Created).json({
        deposit,
        message: "Deposit has been recorded successfully",
      });
    } catch (error) {
      console.error("Error recording deposit:", error);
      return res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while recording the deposit",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(HttpStatusCode.MethodNotAllowed)
      .end(`Method ${req.method} Not Allowed`);
  }
}
