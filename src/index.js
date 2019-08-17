import * as charCodesFor from './charCodes';
import * as utils from './utils';


const Messup = utils.createMethods({}, {

  number(min = 0, max = 1, hideWarning){
    utils.throwIfNotInteger(min, max);

    if (max < min)
      throw new TypeError('The `max` argument cannot be smaller than the `min` argument.');

    if (hideWarning !== true)
      utils.warnIfTooBig(min, max);

    return utils.inclusiveRangeRandom(min, max);
  },

  numberByLength(length, hideWarning){
    utils.throwIfInvalidLength('character', length);

    if (hideWarning !== true && length > 15)
      utils.warnIfTooBig(true);

    let result;

    do {
      result = utils.randomFrom(charCodesFor.NUM, length);
    } while (result[0] === '0');

    return parseInt(result, 10);
  },

  string(length, customChars){
    utils.throwIfInvalidLength('character', length);

    if (typeof customChars !== 'string' || customChars.length <= 0)
      customChars = charCodesFor.ALL;

    return utils.randomFrom(customChars, length)
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
    return Messup.string(
      length,
      charCodesFor.NUM.concat(charCodesFor.UPC, charCodesFor.LWC)
    );
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

});

try {

  const { randomBytes } = require('crypto');

  if (typeof randomBytes !== 'function')
    throw '';

  utils.createMethods(Messup, {
    bytes(bytes, encoding){
      utils.throwIfInvalidLength('byte', bytes);
      const ret = randomBytes(bytes);
      return typeof encoding === 'string'
        ? ret.toString(encoding)
        : ret;
    }
  });

} catch(e){

  if (!(window && window.crypto && typeof window.crypto.getRandomValues === 'function'))
    Messup.bytes = null;

  else {

    utils.createMethods(Messup, {
      bytes(bytes, encoding){
        utils.throwIfInvalidLength('byte', bytes);
  
        // Use Uint8Array to simulate NodeJS's Buffer
        const buffer = new Uint8Array(bytes);
  
        window.crypto.getRandomValues(buffer);
  
        switch(encoding){
          case 'hex':
            return utils.toHex(buffer);
          case 'base64':
            return window.btoa(String.fromCharCode.apply(String, buffer));
          default:
            if (typeof encoding !== 'string')
              return buffer;
            else
              throw new TypeError(`Unsupported encoding: "${encoding}". Messup.bytes in browser currently only accept "hex" and "base64" encoding.`);
        }
      }
    });

  }

}


export default Messup;
