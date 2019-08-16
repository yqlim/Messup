export function throwIfInvalidLength(type, length){
  if (typeof length !== 'number')
    throw new TypeError('Length must be specified with a positive integer.');

  if (length < 1)
    throw new RangeError(`Cannot generate less than 1 ${type}.`);
}

export function throwIfNotInteger(){
  forEach(arguments, function isInteger(n){
    if (n % 1 !== 0)
      throw new TypeError(`Number ${n} is not an integer.`);
  });
}

export function warnIfTooBig(){
  forEach(arguments, function isTooBig(int){
    if (int.toString().length > 15){
      console.warn(`Number ${int} cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result.`);
    }
  });
}

export function randomFrom(list, resultLength){
  const listLength = list.length;

  let ret = '';

  while (resultLength--){
    ret += list[~~(Math.random() * listLength)];
  }

  return ret;
}

export function inclusiveRangeRandom(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function insecureRandomByte(){
  return inclusiveRangeRandom(0, 255);
}

export function toHex(buffer){
  if (typeof buffer === 'number'){
    return toRadix16(byte);
  }

  let ret = '';

  const len = buffer.length;
  for (let i = 0; i < len; i++){
    ret += toRadix16(byte[i]);
  }

  return ret;
}

function forEach(iterable, callback, context){
  Array.prototype.forEach.call(iterable, callback, context);
}

function leftPad(str, expectedLength, pad = '0'){
  while (str.length < expectedLength){
    str = pad + str;
  }
  return str;
}

function toRadix16(n){
  const hex = n.toString(16);
  return leftPad(hex, 2);
}
