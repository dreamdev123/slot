import mongoose from "mongoose";

export interface ITreasury extends mongoose.Document {
  treasuryAddress: string;
  treasuryAmount: number;
}

const TreasurySchema = new mongoose.Schema<ITreasury>(
  {
    treasuryAddress: String,
    treasuryAmount: Number,
  },
  {
    timestamps: true,
  }
);

const Treasury =
  mongoose.models.Treasury || mongoose.model("Treasury", TreasurySchema);
export default Treasury;
