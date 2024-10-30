import { HttpStatusCode } from "axios";
import connectMongo from "../../../../config/database";
import User from "../../../../models/userSchema";
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
        const user = await User.findById(id);

        if (!user) {
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: "User not found" });
        }

        res.status(HttpStatusCode.Ok).json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: "Error fetching user" });
      }
      break;
    case "PUT":
      try {
        const { id } = req.query;
        const updateData = req.body;

        console.log("Updating user with ID:", id);
        console.log("Update data:", updateData);

        // Ensure currentBalance is a number
        if (updateData.currentBalance) {
          updateData.currentBalance = Number(updateData.currentBalance);
          if (isNaN(updateData.currentBalance)) {
            return res
              .status(HttpStatusCode.BadRequest)
              .json({ message: "Invalid currentBalance value" });
          }
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });

        if (!updatedUser) {
          console.log("User not found for ID:", id);
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: "User not found" });
        }

        console.log("User updated successfully:", updatedUser);
        res
          .status(HttpStatusCode.Ok)
          .json({ message: "User updated successfully", user: updatedUser });
      } catch (error) {
        console.error("Error updating user:", error);
        res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: "Error updating user", error });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.query;
        const deletedUser = await User.findByIdAndDelete(id);

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
