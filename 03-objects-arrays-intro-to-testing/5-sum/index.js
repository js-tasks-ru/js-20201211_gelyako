/**
 * Sum - returns sum of arguments if they can be converted to a number
 * @param {number} n value
 * @returns {number | function}
 */
export function sum (n) {
  const toNumber = (str) => isFinite(str) ? +str : 0;
  let sum = toNumber(n);
  let sumFn = (m) => {
    sum += toNumber(m);
    return sumFn;
  };
  sumFn.toString = function() {
    return String(sum);
  };
  return sumFn;
}
