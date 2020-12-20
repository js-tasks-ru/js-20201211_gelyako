/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size !== 'number') {
    return string;
  }
  let trimmedChars = [];
  let previousChar;
  let amount;
  for (const char of string) {
    if (char !== previousChar) {
      previousChar = char;
      amount = 1;
    } else {
      ++amount;
    }

    if (amount <= size) {
      trimmedChars.push(char);
    }
  }
  return trimmedChars.join('');
}
