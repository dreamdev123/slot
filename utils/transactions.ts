import { ethers } from "ethers";

/**
 * Sends Ether to a specified wallet address.
 *
 * @param {string} to - The recipient wallet address.
 * @param {string} amount - The amount in Ether to send as a string.
 * @param {ethers.Wallet} signer - The signer instance to authorize the transaction.
 * @returns {Promise<string>} - The transaction hash.
 */
export async function sendTransaction(
  to: string,
  amount: string,
  signer: ethers.Wallet
): Promise<string> {
  try {
    if (!ethers.utils.isAddress(to)) {
      throw new Error("Invalid wallet address.");
    }

    // Ensure amount is a string before parsing
    const parsedAmount = ethers.utils.parseEther(amount.toString());

    const tx = await signer.sendTransaction({
      to,
      value: parsedAmount,
    });

    await tx.wait(); // Wait for transaction confirmation

    console.log(`Transaction successful with hash: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error("sendTransaction error:", error);
    throw error;
  }
}
