import * as constants from './constants';
import * as utils from './utils';


const Messup = utils.createMethods({}, {

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
    } while (result[0] === '0');

    return parseInt(result, 10);
  },

  string(length, customCharSet){
    utils.throwIfInvalidLength('character', length);

    if (typeof customCharSet !== 'string' || customCharSet.length <= 0)
      customCharSet = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

    return utils.randomFrom(customCharSet, length)
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
      constants.NUM.concat(constants.UPC, constants.LWC)
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
