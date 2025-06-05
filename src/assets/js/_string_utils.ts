export function zeroPadding(num: number, qty: number): string {
  if (!Number.isInteger(num) || num < 0) {
    throw new Error("num must be a positive integer");
  }

  const numString = `${num}`;
  if (qty < numString.length) {
    console.warn("num is too large");
    return numString;
  }
  const stringBeforeSlice = `${"0".repeat(qty)}${numString}`;
  return stringBeforeSlice.slice(qty * -1);
}
