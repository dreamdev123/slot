import mongoose from "mongoose";

export interface IWithdraw extends mongoose.Document {
  username: string;
  pfpUrl: string;
  walletAddress: string;
  amount: number;
  transactionAddress: string;
  transactionStatus: boolean;
  createdAt: Date;
}

const WithdrawSchema = new mongoose.Schema<IWithdraw>(
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

const Withdraw =
  mongoose.models.Withdraw || mongoose.model("Withdraw", WithdrawSchema);
export default Withdraw;
