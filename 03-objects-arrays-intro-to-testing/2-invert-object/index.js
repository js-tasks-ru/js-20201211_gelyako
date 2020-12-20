/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj !== "object") {
    return undefined;
  }
  const valueToKey = Object.entries(obj).map(([key, value]) => [value, key]);
  return Object.fromEntries(valueToKey);
}
