import { ethers } from "ethers";
import { updateUser } from "../../../../data/userData";
import {
  fetchLatestTreasuryData,
  updateTreasury,
} from "../../../../data/treasuryData";
import { sendTransaction } from "../../../../utils/transactions";
import convertUsdToEth from "../../../../utils/convertUsdToEth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { amount, walletAddress } = req.body;

  console.log(
    `Received Withdrawal Request: Amount=${amount}, Type=${typeof amount}, WalletAddress=${walletAddress}`
  );

  try {
    const API_KEY = process.env.INFURA_PROJECT_ID;
    const TREASURY_KEY = process.env.TREASURY_KEY;

    if (!API_KEY || !TREASURY_KEY) {
      console.error(
        "Missing INFURA_PROJECT_ID or TREASURY_KEY in environment variables."
      );
      return res.status(500).json({ message: "Server configuration error." });
    }
    const provider = new ethers.providers.InfuraProvider("sepolia", API_KEY);
    const signer = new ethers.Wallet(TREASURY_KEY, provider);

    const network = await provider.getNetwork();
    console.log("Connected to network:", network);

    if (network.chainId !== 11155111) {
      // Sepolia Chain ID
      console.error(
        `Incorrect network detected: ${network.name} (${network.chainId})`
      );
      return res
        .status(400)
        .json({ message: "Incorrect network. Please use Sepolia." });
    }

    // Parse the ETH amount in Wei
    let ethAmount;
    if (typeof amount === "number") {
      ethAmount = ethers.BigNumber.from(amount);
    } else if (typeof amount === "string") {
      ethAmount = ethers.BigNumber.from(amount);
      if (ethAmount.isZero() || ethAmount.lt(0)) {
        throw new Error("Invalid amount format. Must be a positive value.");
      }
    } else {
      throw new Error(
        "Invalid amount type. Amount must be a string or number."
      );
    }

    // Convert Wei to ETH for logging and validation
    const ethAmountInEth = parseFloat(ethers.utils.formatEther(ethAmount));

    if (ethAmountInEth <= 0) {
      throw new Error("Withdrawal amount must be greater than zero.");
    }

    console.log(`Validated ETH Amount: ${ethAmountInEth} ETH`);

    // Proceed with sending the transaction
    const transactionHash = await sendTransaction(
      walletAddress,
      ethAmountInEth.toString(), // ETH amount as string
      signer
    );

    console.log("Withdrawal successful");

    res.status(200).json({ transactionHash });
  } catch (error) {
    console.error("Withdrawal error:", error.message);
    if (error.code === "NETWORK_ERROR") {
      return res
        .status(503)
        .json({ message: "Network error. Please try again later." });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}
