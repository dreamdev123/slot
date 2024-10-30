export default async function convertUsdToEth(usdAmount: number) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();

    if (!data.ethereum || !data.ethereum.usd) {
      throw new Error("Failed to fetch ETH to USD rate.");
    }

    const ethToUsdRate = data.ethereum.usd;
    let ethAmount = usdAmount / ethToUsdRate;

    if (isNaN(ethAmount) || ethAmount <= 0) {
      throw new Error("Invalid ETH amount calculated.");
    }

    ethAmount = parseFloat(ethAmount.toFixed(18));
    console.log(`Converting $${usdAmount} to ETH: ${ethAmount} ETH`);
    return ethAmount;
  } catch (error) {
    console.error("Error converting USD to ETH:", error);
    throw error;
  }
}
