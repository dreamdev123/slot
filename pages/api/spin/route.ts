import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import connectMongo from "../../../config/database";
import Spin from "../../../models/spinSchema";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const { username, pfpUrl, spinPrice, outcome, moneyEarned } = req.body;

      // FIX VALIDATION: Ensure all required fields are present
      if (
        !username ||
        !pfpUrl ||
        spinPrice === undefined ||
        outcome === undefined ||
        moneyEarned === undefined
      ) {
        return res.status(HttpStatusCode.BadRequest).json({
          message:
            "Username, pfpUrl, spinPrice, outcome, and money earned are required",
        });
      }

      const spin = await Spin.create({
        username,
        pfpUrl,
        spinPrice,
        outcome,
        moneyEarned,
      });

      res.status(HttpStatusCode.Created).json({
        spin,
        message: "Spin has been created successfully",
      });
    } catch (error) {
      console.error("Error creating spin:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while creating the spin",
      });
    }
  } else if (req.method === "GET") {
    try {
      const spins = await Spin.find({})
        .select("-password")
        .sort({ createdAt: -1 });
      const count = await Spin.countDocuments({});

      res.status(HttpStatusCode.Ok).json({
        count,
        spins,
        message: "Spins retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching spins:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while fetching spins",
      });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .end(`Method ${req.method} Not Allowed`);
  }
}
