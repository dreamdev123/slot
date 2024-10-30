import mongoose from "mongoose";

export interface IDeposit extends mongoose.Document {
  username: string;
  pfpUrl: string;
  walletAddress: string;
  amount: number;
  transactionAddress: string;
  transactionStatus: boolean;
  createdAt: Date;
}

const DepositSchema = new mongoose.Schema<IDeposit>(
  {
    username: String,
    pfpUrl: String,
    walletAddress: String,
    amount: Number,
    transactionAddress: String,
    transactionStatus: Boolean,
  },
  {
    timestamps: true,
  }
);

const Deposit =
  mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema);
export default Deposit;
