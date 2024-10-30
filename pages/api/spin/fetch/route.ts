import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import connectMongo from "../../../../config/database";
import Spin from "../../../../models/spinSchema";

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

      const count = await Spin.find({
        username: { $regex: regex },
      }).countDocuments();

      const spins = await Spin.find({ username: { $regex: regex } })
        .sort({ createdAt: -1 })
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1));
      return res.status(HttpStatusCode.Ok).json({ count, spins });
    } catch (error) {
      console.error("Error fetching deposits:", error);
      return res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while fetching the deposits",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .end(`Method ${req.method} Not Allowed`);
  }
}
