/**
 * Char Codes for:
 * 0-9 -> from 48
 * A-Z -> from 65
 * a-z -> from 97
 * All -> from 33 to 126
 */


export const NUM = fromCharCodeRange(48, 48 + 9);
export const UPC = fromCharCodeRange(65, 65 + 25);
export const LWC = fromCharCodeRange(97, 97 + 25);
export const ALL = fromCharCodeRange(33, 126);


function fromCharCodeRange(min, max){
  let ret = '';

  for (let i = min; i <= max; i++){
    ret += String.fromCharCode(i);
  }

  return ret;
}
