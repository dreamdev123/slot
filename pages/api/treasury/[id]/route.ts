import { HttpStatusCode } from "axios";
import connectMongo from "../../../../config/database";
import Treasury from "../../../../models/treasurySchema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  switch (req.method) {
    case "GET":
      try {
        const { id } = req.query;

        const treasury = await Treasury.findById(id);

        if (!treasury) {
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: "Treasury not found" });
        }

        res.status(HttpStatusCode.Ok).json({
          message: "Treasury fetched successfully",
          treasury: treasury,
        });
      } catch (error) {
        console.error("Error fetching treasury:", error);
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: "Error fetching treasury" });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query;
        const updateData = req.body;

        const updatedTreasury = await Treasury.findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
          }
        );

        if (!updatedTreasury) {
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: "Treasury not found" });
        }

        res.status(HttpStatusCode.Ok).json({
          message: "Treasury updated successfully",
          treasury: updatedTreasury,
        });
      } catch (error) {
        console.error("Error updating treasury:", error);
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: "Error updating treasury" });
      }
      break;

    default:
      res
        .status(HttpStatusCode.MethodNotAllowed)
        .json({ message: "Method not allowed" });
  }
}
