export function formatMoney(amount: number) {
  return parseFloat((Math.round(amount * 100) / 100).toFixed(2));
}
