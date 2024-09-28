/*
  Write a function `findLargestElement` that takes an array of numbers and returns the largest element.
  Example:
  - Input: [3, 7, 2, 9, 1]
  - Output: 9
*/

function findLargestElement(numbers) {

    if(numbers.length == 0) return ;

   return numbers.reduce((acc,curr)=> Math.max(acc,curr))
}
// console.log(findLargestElement([1, 2, 3, 4, 5, 7, 6]))
module.exports = findLargestElement;