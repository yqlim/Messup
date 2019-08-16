import * as constants from './constants';
import * as utils from './utils';


const Messup = {

  number(min = 0, max = 1, hideWarning){
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

    do {
      result = utils.randomFrom(constants.NUM, length);
    } while (result[0] !== '0');

    return result;
  },

  string(length, customCharSet){
    utils.throwIfInvalidLength('character', length);

    if (typeof customCharSet === 'string' && customCharSet.length > 0)
      return utils.randomFrom(customCharSet, length);

    let ret = '';

    while (length--){
      const randomCharCode = Messup.number(
        constants.CHARCODE_OF_KEYBOARD_CHARS_LOWEST,
        constants.CHARCODE_OF_KEYBOARD_CHARS_HIGHEST
      );
      ret += String.fromCharCode(randomCharCode);
    }

    return ret;
  },

  hex(bytes, useUpperCase){
    utils.throwIfInvalidLength('byte', bytes);

    let result = '';

    for (let i = 0; i < bytes; i++){
      const randomBytes = utils.insecureRandomByte();
      result += utils.toHex(randomBytes);
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
      result += String.fromCharCode(utils.insecureRandomByte());
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
      const buffer = new Uint8Array(bytes);

      window.crypto.getRandomValues(buffer);

      switch(encoding){
        case 16:
        case 'hex':
          return utils.toHex(buffer);
        case 64:
        case 'base64':
          return window.btoa(String.fromCharCode.apply(String, buffer));
        default:
          if (!encoding)
            return buffer;
          else
            throw new TypeError('MesseyString.bytes in browser only accept "hex" and "base64" encoding.');
      }
    }

  }

}


export default Object.freeze(Messup);
