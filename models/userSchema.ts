import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  username: string;
  password?: string;
  pfpUrl: string;
  currentBalance: number;
  spinsWon: number;
  totalSpins: number;
  totalEarnings: number;
  totalDeposits: number;
  walletAddress: string;
  isAdmin: boolean;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      default: "",
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
      maxlength: 30,
    },
    password: {
      type: String,
    },
    pfpUrl: String,
    currentBalance: {
      type: Number,
      default: 0,
    },
    spinsWon: {
      type: Number,
      default: 0,
    },
    totalSpins: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalDeposits: {
      type: Number,
      default: 0,
    },
    walletAddress: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
