/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

function isPalindrome(str) {

  let filterdText = '';

  for (let char of str) {
    if ((char >= 'a' && char <= 'z') || (char >= "A" && char <= "Z") || (char >= '0' && char <= '9')) {
      filterdText += char.toLowerCase();
    }
  }

  
  
  let left = 0;
  let right = filterdText.length - 1;
  
  while (left < right) {
    
    if (filterdText[left] !== filterdText[right]) {
      return false
    }
    left++;
    right--;
  }

  return true;
}


module.exports = isPalindrome;
