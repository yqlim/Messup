import * as constants from './constants';
import * as utils from './utils';


const Messup = {

  number(min, max, hideWarning){
    utils.throwIfNotInteger(min, max);

    if (max < min){
      throw new TypeError('The `max` argument cannot be smaller than the `min` argument.');
    }

    if (hideWarning !== true){
      utils.warnIfTooBig(min, max);
    }

    return utils.inclusiveRangeRandom(min, max);
  },

  numberByLength(length, hideWarning){
    utils.throwIfInvalidLength('character', length);

    if (hideWarning !== true && length > 15){
      console.warn(`Numbers with more than 15 digits cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result.`);
    }

    let result;

    while (true){
      result = utils.randomFrom(constants.NUM, length);
      if (result[0] !== '0'){
        result = parseInt(result);
        break;
      }
    }

    return result;
  },

  string(length){
    utils.throwIfInvalidLength('character', length);

    let ret = '';

    while (length--){
      ret += String.fromCharCode(Messup.number(constants.CHARCODE_OF_KEYBOARD_CHARS_LOWEST, constants.CHARCODE_OF_KEYBOARD_CHARS_HIGHEST));
    }

    return ret;
  },

  hex(bytes, useUpperCase){
    utils.throwIfInvalidLength('byte', bytes);

    let result = '';

    for (let i = 0; i < bytes; i++){
      result += utils.leftPad(utils.inclusiveRangeRandom(0, 255).toString(16), 2, 0);
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

  base64(bytes){
    utils.throwIfInvalidLength('byte', bytes);

    let result = '';

    for (let i = 0; i < bytes; i++){
      result += String.fromCharCode(utils.inclusiveRangeRandom(0, 255));
    }

    try {
      return global.Buffer.from(result).toString('base64');
    } catch (e) {
      return window.btoa(result);
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
        const len = typedArray.length;

        let ret = '';

        for (let i = 0; i < len; i++){
          ret += toRadix16(typedArray[i]);
        }

        return ret;
      }

      function toRadix16(string){
        const hex = Number(string).toString(16);

        // Conditionally add leading zero
        // because leading zero is truncated by `Number(string)`
        return (hex.length === 1 ? '0' : '') + hex;
      }
    }

  }

}


export default Object.freeze(Messup);
