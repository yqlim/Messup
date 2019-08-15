import * as constants from './constants';
import * as utils from './utils';


const Messup = {

  fromRange(min = 0, max = 1, hideWarning){
    if (hideWarning !== true){
      utils.warnIfTooBig(min, max);
    }

    if (max < min){
      throw new TypeError('The `max` argument cannot be smaller than the `min` argument.');
    }

    let diff = Math.abs(max - min);

    // To make upper limit inclusion possible
    // because `Math.floor` is used.
    diff += 1;

    return Math.floor(Math.random() * diff + min);
  },

  number(length){
    utils.throwIfInvalidLength('character', length);

    const result = utils.randomFrom(constants.NUM, length);

    return parseInt(result);
  },

  string(length){
    utils.throwIfInvalidLength('character', length);

    let ret = '';

    while (length--){
      ret += String.fromCharCode(Messup.fromRange(constants.CHARCODE_OF_KEYBOARD_CHARS_LOWEST, constants.CHARCODE_OF_KEYBOARD_CHARS_HIGHEST));
    }

    return ret;
  },

  hex(byte, useUpperCase){
    utils.throwIfInvalidLength('byte', byte);

    const str = Messup.string(byte);

    let result = '';

    try {
      result = Buffer.from(str).toString('hex');
    } catch(e){
      for (let i = 0; i < byte; i++){
        result += str.charCodeAt(i).toString(16);
      }
    }

    return useUpperCase === true
      ? result.toUpperCase()
      : result;
  },

  base62(length){
    utils.throwIfInvalidLength('character', length);

    const map = constants.NUM.concat(constants.UPC, constants.LWC);

    return utils.randomFrom(map, length);
  },

  base64(byte){
    utils.throwIfInvalidLength('byte', byte);

    const str = Messup.string(byte);
    try {
      return Buffer.from(str).toString('base64');
    } catch (e) {
      return window.btoa(str);
    }
  }

};


try {

  const { randomBytes } = require('crypto');

  Messup.bytes = function bytes(bytes, encoding){
    utils.throwIfInvalidLength('byte', bytes);
    const ret = randomBytes(bytes);
    return typeof encoding === 'string'
      ? ret.toString(encoding)
      : ret;
  }

} catch(e){

  if (!(window && window.crypto && typeof window.crypto.getRandomValues === 'function'))
    Messup.bytes = null;

  else {

    Messup.bytes = function bytes(bytes, encoding){
      utils.throwIfInvalidLength('byte', bytes);

      // Use Uint8Array to simulate NodeJS's Buffer
      let array = new Uint8Array(bytes);

      window.crypto.getRandomValues(array);

      switch(encoding){
        case 16:
        case 'hex':
          return toHex(array);
        case 64:
        case 'base64':
          return window.btoa(String.fromCharCode.apply(String, array));
        default:
          if (!encoding)
            return array;
          else
            throw new TypeError('MesseyString.bytes in browser only accept "hex" and "base64" encoding.');
      }

      function toHex(typedArray){
        return typedArray
          .toLocaleString()   // IE does not support array methods in TypedArrays
          .split(/[^0-9]/g)
          .map(toRadix16)
          .join('');
      }

      function toRadix16(string){
        const hex = Number(string).toString(16);

        // Conditionally leading zero
        // because leading zero is truncated by `Number(string)`
        return (hex.length === 1 ? '0' : '') + hex;
      }
    }

  }

}


export default Object.freeze(Messup);
