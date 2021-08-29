const moment = require('moment');

const date = ''

const tmpDate = moment(new Date()).format('DD/MM/YYYY, hh:mm:ss')
console.log(typeof tmpDate)
const arr = [1,2,3,1,55,6,-3,5,9,-5];



// const findLargestSum = (array, num) => {
//     let max = 0;
//     for(let i = 0; i< array.length - num + 1; i++) {
//         let tmp = 0;
//         for(let j = 0; j < num; j++) {
//             tmp += array[i + j];
//         }
//      //   console.log(tmp);
//         if(tmp > max) {
//             max = tmp;
//         }
//       //  console.log(max);
//     }
//     return max;
// }

// const findSumZero = (arr) => {
//     for(let i = 0; i < arr.length - 1; i++) {
//         for(let j = i + 1; j < arr.length; j++) {
//             if(arr[i] + arr[j] === 0) {
//                 return [arr[i], arr[j]];
//             }
//         }
//     }
//
//     return null
// }

const findSumZeroOpti = (arr, num) => {
    let left = 0;
    let right = arr.length - 1;
    while (right > left) {
        let sum = arr[left] + arr[right];
        if(sum === num)
            return [arr[left], arr[right]];
        else if (sum > num) {
            right--;
        } else
            left ++;
    }

    return false;
}

//console.log(findSumZeroOpti(arr.sort(), 5));

//console.log(findLargestSum(arr, 2));