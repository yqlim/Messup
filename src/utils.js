export function throwIfInvalidLength(type, length){
  if (typeof length !== 'number')
    throw new TypeError('Length must be specified with a positive integer.');

  if (length < 1)
    throw new RangeError(`Cannot generate less than 1 ${type}.`);
}

export function throwIfNotInteger(){
  forEach(arguments, function(n){
    if (n % 1 !== 0)
      throw new TypeError(`Number ${n} is not an integer.`);
  });
}

export function warnIfTooBig(){
  forEach(arguments, function(int){
    if (int.toString().replace(/[^0-9]/g).length > 15){
      console.warn(`Number ${int} is cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result.`);
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


function forEach(iterable, callback, context){
  Array.prototype.forEach.call(iterable, callback, context);
}
