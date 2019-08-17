/*!
 * Messup
 * (c) 2019 Yong Quan Lim
 * Released under MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Messup = factory());
}(this, function () { 'use strict';

  /**
   * Char Codes for:
   * 0-9 -> from 48
   * A-Z -> from 65
   * a-z -> from 97
   * All -> from 33 to 126
   */
  var NUM = fromCharCodeRange(48, 48 + 9);
  var UPC = fromCharCodeRange(65, 65 + 25);
  var LWC = fromCharCodeRange(97, 97 + 25);
  var ALL = fromCharCodeRange(33, 126);

  function fromCharCodeRange(min, max) {
    var ret = '';

    for (var i = min; i <= max; i++) {
      ret += String.fromCharCode(i);
    }

    return ret;
  }

  function createMethods(target, obj) {
    for (var prop in obj) {
      Object.defineProperty(target, prop, {
        value: obj[prop]
      });
    }

    return target;
  }
  function throwIfInvalidLength(type, length) {
    if (typeof length !== 'number') throw new TypeError('Length must be specified with a positive integer.');
    if (length < 1) throw new RangeError("Cannot generate less than 1 ".concat(type, "."));
  }
  function throwIfNotInteger() {
    forEach(arguments, function isInteger(n) {
      if (typeof n !== 'number' || n % 1 !== 0) throw new TypeError("Number ".concat(n, " is not an integer."));
    });
  }
  function warnIfTooBig(justWarn) {
    if (justWarn === true) warn();else forEach(arguments, isTooBig);

    function warn() {
      console.warn('Numbers with more than 15 digits cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result.');
    }

    function isTooBig(int) {
      if (int.toString(10).length > 15) warn();
    }
  }
  function randomFrom(list, resultLength) {
    var listLength = list.length;
    var ret = '';

    while (resultLength--) {
      ret += list[~~(Math.random() * listLength)];
    }

    return ret;
  }
  function inclusiveRangeRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function insecureRandomByte() {
    return inclusiveRangeRandom(0, 255);
  }
  function toHex(buffer) {
    if (typeof buffer === 'number') {
      return toRadix16(buffer);
    }

    var ret = '';
    var len = buffer.length;

    for (var i = 0; i < len; i++) {
      ret += toRadix16(buffer[i]);
    }

    return ret;
  }

  function forEach(iterable, callback, context) {
    Array.prototype.forEach.call(iterable, callback, context);
  }

  function leftPad(str, expectedLength) {
    var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';

    while (str.length < expectedLength) {
      str = pad + str;
    }

    return str;
  }

  function toRadix16(n) {
    var hex = n.toString(16);
    return leftPad(hex, 2);
  }

  var Messup = createMethods({}, {
    number: function number() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var hideWarning = arguments.length > 2 ? arguments[2] : undefined;
      throwIfNotInteger(min, max);
      if (max < min) throw new TypeError('The `max` argument cannot be smaller than the `min` argument.');
      if (hideWarning !== true) warnIfTooBig(min, max);
      return inclusiveRangeRandom(min, max);
    },
    numberByLength: function numberByLength(length, hideWarning) {
      throwIfInvalidLength('character', length);
      if (hideWarning !== true && length > 15) warnIfTooBig(true);
      var result;

      do {
        result = randomFrom(NUM, length);
      } while (result[0] === '0');

      return parseInt(result, 10);
    },
    string: function string(length, customChars) {
      throwIfInvalidLength('character', length);
      if (typeof customChars !== 'string' || customChars.length <= 0) customChars = ALL;
      return randomFrom(customChars, length);
    },
    hex: function hex(bytes, useUpperCase) {
      throwIfInvalidLength('byte', bytes);
      var result = '';

      for (var i = 0; i < bytes; i++) {
        var randomBytes = insecureRandomByte();
        result += toHex(randomBytes);
      }

      return useUpperCase === true ? result.toUpperCase() : result;
    },
    base62: function base62(length) {
      return Messup.string(length, NUM.concat(UPC, LWC));
    },
    base64: function base64(bytes) {
      throwIfInvalidLength('byte', bytes);
      var result = '';

      for (var i = 0; i < bytes; i++) {
        result += String.fromCharCode(insecureRandomByte());
      }

      try {
        return global.Buffer.from(result).toString('base64');
      } catch (e) {
        return window.btoa(result);
      }
    }
  });

  try {
    var _require = require('crypto'),
        randomBytes = _require.randomBytes;

    if (typeof randomBytes !== 'function') throw '';
    createMethods(Messup, {
      bytes: function bytes(_bytes, encoding) {
        throwIfInvalidLength('byte', _bytes);
        var ret = randomBytes(_bytes);
        return typeof encoding === 'string' ? ret.toString(encoding) : ret;
      }
    });
  } catch (e) {
    if (!(window && window.crypto && typeof window.crypto.getRandomValues === 'function')) Messup.bytes = null;else {
      createMethods(Messup, {
        bytes: function bytes(_bytes2, encoding) {
          throwIfInvalidLength('byte', _bytes2); // Use Uint8Array to simulate NodeJS's Buffer

          var buffer = new Uint8Array(_bytes2);
          window.crypto.getRandomValues(buffer);

          switch (encoding) {
            case 'hex':
              return toHex(buffer);

            case 'base64':
              return window.btoa(String.fromCharCode.apply(String, buffer));

            default:
              if (typeof encoding !== 'string') return buffer;else throw new TypeError("Unsupported encoding: \"".concat(encoding, "\". Messup.bytes in browser currently only accept \"hex\" and \"base64\" encoding."));
          }
        }
      });
    }
  }

  return Messup;

}));
