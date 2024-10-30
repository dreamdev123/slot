import { HttpStatusCode } from "axios";
import connectMongo from "../../../../../config/database";
import User from "../../../../../models/userSchema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  switch (req.method) {
    case "GET":
      try {
        const { walletAddress } = req.query;

        const user = await User.findOne({ walletAddress }).select("-password");

        if (!user) {
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: "User not found" });
        }

        res
          .status(HttpStatusCode.Ok)
          .json({ message: "User retrieved successfully", user });
      } catch (error) {
        console.error("Error retrieving user:", error);
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: "Error retrieving user" });
      }
      break;
    case "PUT":
      try {
        const { walletAddress } = req.query;
        const updateData = req.body;

        const updatedUser = await User.findOneAndUpdate(
          { walletAddress },
          updateData,
          {
            new: true,
          }
        );

        if (!updatedUser) {
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: "User not found" });
        }

        res
          .status(HttpStatusCode.Ok)
          .json({ message: "User updated successfully", user: updatedUser });
      } catch (error) {
        console.error("Error updating user:", error);
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: "Error updating user" });
      }
      break;
    case "DELETE":
      try {
        const { walletAddress } = req.query;
        const deletedUser = await User.findOneAndDelete({ walletAddress });

        if (!deletedUser) {
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: "User not found" });
        }

        res
          .status(HttpStatusCode.Ok)
          .json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: "Error deleting user" });
      }
      break;

    default:
      res
        .status(HttpStatusCode.MethodNotAllowed)
        .json({ message: "Method not allowed" });
  }
}
