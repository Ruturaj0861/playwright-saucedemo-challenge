/**
 * @param priceString
 * @returns
 */
export function parsePrice(priceString: string): number {
  const match = priceString.match(/[\d.]+/);
  if (match) {
    return parseFloat(match[0]);
  }
  return NaN;
}