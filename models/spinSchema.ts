import mongoose from "mongoose";

export interface ISpin extends mongoose.Document {
  username: string;
  pfpUrl: string;
  spinPrice: number;
  outcome: boolean;
  moneyEarned: number;
  createdAt: Date;
}

const SpinSchema = new mongoose.Schema<ISpin>(
  {
    username: String,
    pfpUrl: String,
    spinPrice: Number,
    outcome: Boolean,
    moneyEarned: Number,
  },
  {
    timestamps: true,
  }
);

const Spin = mongoose.models.Spin || mongoose.model("Spin", SpinSchema);
export default Spin;
