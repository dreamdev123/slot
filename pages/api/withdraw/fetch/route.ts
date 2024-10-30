import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import connectMongo from "../../../../config/database";
import Withdraw from "../../../../models/withdrawSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const { q, page } = req.body;

      if (typeof q !== "string" || typeof page !== "number") {
        return res.status(HttpStatusCode.BadRequest).json({
          message: "Invalid query parameters",
        });
      }

      const regex = new RegExp(q, "i");
      const ITEM_PER_PAGE = 5;

      await connectMongo();
      const count = await Withdraw.find({
        username: { $regex: regex },
      }).countDocuments();

      const withdrawals = await Withdraw.find({ username: { $regex: regex } })
        .sort({ createdAt: -1 })
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1));

      return res.status(HttpStatusCode.Ok).json({ count, withdrawals });
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while fetching the withdrawals",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .end(`Method ${req.method} Not Allowed`);
  }
}
