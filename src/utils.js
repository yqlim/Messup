export function throwIfInvalidLength(length){
  if (typeof length !== 'number')
    throw new TypeError('Length must be specified with a positive integer.');

  if (length < 1)
    throw new RangeError('Cannot generate less than 1 character.');
}

export function throwIfInvalidBytes(byteLength){
  if (typeof byteLength !== 'number')
    throw new TypeError('Length must be specified with a positive integer.');

  if (byteLength < 1)
    throw new RangeError('Cannot generate less than 1 byte.');
}

export function randomFrom(list, resultLength){
  throwIfInvalidLength(resultLength);

  const listLength = list.length;

  let ret = '';

  while (resultLength--){
    ret += list[Math.floor(Math.random() * listLength)];
  }

  return ret;
}
