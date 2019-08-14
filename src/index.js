import * as constants from './constants';
import * as utils from './utils';


const Messup = {

  fromRange(from = 0, to = constants.MAX_SAFE_INTEGER){
    const diff = Math.abs(to - from);
    return Math.floor(Math.random() * (diff + 1) + from);
  },

  number(length, parseAsNumber){
    const ret = utils.randomFrom(constants.NUM, length);
    return parseAsNumber === true
      ? parseInt(ret)
      : ret;
  },

  string(length){
    utils.throwIfInvalidLength(length);

    let ret = '';

    while (length--){
      ret += String.fromCharCode(Messup.fromRange(constants.CHARCODE_OF_KEYBOARD_CHARS_LOWEST, constants.CHARCODE_OF_KEYBOARD_CHARS_HIGHEST));
    }

    return ret;
  },

  hex(length, useUpperCase){
    const map = constants.NUM.concat(useUpperCase === true ? constants.UPC : constants.LWC);
    return utils.randomFrom(map, length);
  },

  base62(length){
    const map = constants.NUM.concat(constants.UPC, constants.LWC);
    return utils.randomFrom(map, length);
  },

  base64(length){
    const map = constants.NUM.concat(constants.UPC, constants.LWC, constants.SYM);
    return utils.randomFrom(map, length);
  }

};


try {

  const { randomBytes } = require('crypto');

  Messup.bytes = function bytes(bytes, encoding){
    utils.throwIfInvalidBytes(bytes);
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
      utils.throwIfInvalidBytes(bytes);

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
