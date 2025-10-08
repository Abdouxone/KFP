export function formatPrice(amount: number) {
  return amount.toLocaleString("en-DZ", { minimumFractionDigits: 0 }) + " Da";
}
