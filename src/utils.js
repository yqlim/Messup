export function createMethods(target, obj){
  for (const prop in obj){
    Object.defineProperty(target, prop, {
      value: obj[prop],
      enumerable: true
    });
  }
  return target;
}

export function throwIfInvalidLength(type, length){
  if (typeof length !== 'number')
    throw new TypeError('Length must be specified with a positive integer.');

  if (length < 1)
    throw new RangeError(`Cannot generate less than 1 ${type}.`);
}

export function throwIfNotInteger(){
  forEach(arguments, function isInteger(n){
    if (typeof n !== 'number' || n % 1 !== 0)
      throw new TypeError(`Number ${n} is not an integer.`);
  });
}

export function warnIfTooBig(justWarn){
  if (justWarn === true)
    warn();
  else
    forEach(arguments, isTooBig);

  function warn(){
    console.warn('Numbers with more than 15 digits cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result.');
  }
  function isTooBig(int){
    if (int.toString(10).length > 15)
      warn();
  }
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
    return toRadix16(buffer);
  }

  let ret = '';

  const len = buffer.length;
  for (let i = 0; i < len; i++){
    ret += toRadix16(buffer[i]);
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
