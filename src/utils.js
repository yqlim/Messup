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
    if (int.toString().replace(/[^0-9]/g).length > 15){
      console.warn(`Number ${int} cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result.`);
    }
  });
}

export function randomFrom(list, resultLength){
  const listLength = list.length;

  let ret = '';

  while (resultLength--){
    ret += list[Math.floor(Math.random() * listLength)];
  }

  return ret;
}

export function forEach(iterable, callback, context){
  Array.prototype.forEach.call(iterable, callback, context);
}

export function leftPad(str, expectedLength, pad){
  const len = str.length;

  if (len >= expectedLength)
    return str;

  for (let i = 0; i < len; i++)
    str = pad + str;

  return str;
}

export function inclusiveRangeRandom(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}
