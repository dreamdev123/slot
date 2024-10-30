import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import connectMongo from "../../../config/database";
import Treasury from "../../../models/treasurySchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const { treasuryAddress, treasuryAmount } = req.body;

      if (!treasuryAddress || !treasuryAmount) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: "treasuryAddress and treasuryAmount are required",
        });
      }

      const treasury = await Treasury.create({
        treasuryAddress,
        treasuryAmount,
      });

      res.status(HttpStatusCode.Created).json({
        treasury,
        message: "Treasury has been created successfully",
      });
    } catch (error) {
      console.error("Error creating treasury:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while creating the treasury",
      });
    }
  } else if (req.method === "GET") {
    try {
      const treasury = await Treasury.find({})
        .select("-password")
        .sort({ createdAt: -1 });
      const count = await Treasury.countDocuments({});

      res.status(HttpStatusCode.Ok).json({
        count,
        treasury,
        totalTreasuries: count,
        message: "Treasuries retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching treasuries:", error);
      res.status(HttpStatusCode.InternalServerError).json({
        message: "An error occurred while fetching treasuries",
      });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .end(`Method ${req.method} Not Allowed`);
  }
}
