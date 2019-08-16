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

  var NUM = '0123456789';
  var UPC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LWC = 'abcdefghijklmnopqrstuvwxyz';
  var CHARCODE_OF_KEYBOARD_CHARS_LOWEST = 33;
  var CHARCODE_OF_KEYBOARD_CHARS_HIGHEST = 126;

  function throwIfInvalidLength(type, length) {
    if (typeof length !== 'number') throw new TypeError('Length must be specified with a positive integer.');
    if (length < 1) throw new RangeError("Cannot generate less than 1 ".concat(type, "."));
  }
  function throwIfNotInteger() {
    forEach(arguments, function isInteger(n) {
      if (n % 1 !== 0) throw new TypeError("Number ".concat(n, " is not an integer."));
    });
  }
  function warnIfTooBig() {
    forEach(arguments, function isTooBig(int) {
      if (int.toString().length > 15) {
        console.warn("Number ".concat(int, " cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result."));
      }
    });
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
      return toRadix16(byte);
    }

    var ret = '';
    var len = buffer.length;

    for (var i = 0; i < len; i++) {
      ret += toRadix16(byte[i]);
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

  var Messup = {
    number: function number() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var hideWarning = arguments.length > 2 ? arguments[2] : undefined;
      throwIfNotInteger(min, max);

      if (max < min) {
        throw new TypeError('The `max` argument cannot be smaller than the `min` argument.');
      }

      if (hideWarning !== true) {
        warnIfTooBig(min, max);
      }

      return inclusiveRangeRandom(min, max);
    },
    numberByLength: function numberByLength(length, hideWarning) {
      throwIfInvalidLength('character', length);

      if (hideWarning !== true && length > 15) {
        console.warn("Numbers with more than 15 digits cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result.");
      }

      var result;

      do {
        result = randomFrom(NUM, length);
      } while (result[0] !== '0');

      return result;
    },
    string: function string(length, customCharSet) {
      throwIfInvalidLength('character', length);
      if (typeof customCharSet === 'string' && customCharSet.length > 0) return randomFrom(customCharSet, length);
      var ret = '';

      while (length--) {
        var randomCharCode = Messup.number(CHARCODE_OF_KEYBOARD_CHARS_LOWEST, CHARCODE_OF_KEYBOARD_CHARS_HIGHEST);
        ret += String.fromCharCode(randomCharCode);
      }

      return ret;
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
      throwIfInvalidLength('character', length);
      var map = NUM.concat(UPC, LWC);
      return randomFrom(map, length);
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
  };

  try {
    var _require = require('crypto'),
        randomBytes = _require.randomBytes;

    Messup.bytes = function bytes(bytes, encoding) {
      throwIfInvalidLength('byte', bytes);
      var ret = randomBytes(bytes);
      return typeof encoding === 'string' ? ret.toString(encoding) : ret;
    };
  } catch (e) {
    if (!(window && window.crypto && typeof window.crypto.getRandomValues === 'function')) Messup.bytes = null;else {
      Messup.bytes = function bytes(bytes, encoding) {
        throwIfInvalidLength('byte', bytes); // Use Uint8Array to simulate NodeJS's Buffer

        var buffer = new Uint8Array(bytes);
        window.crypto.getRandomValues(buffer);

        switch (encoding) {
          case 16:
          case 'hex':
            return toHex(buffer);

          case 64:
          case 'base64':
            return window.btoa(String.fromCharCode.apply(String, buffer));

          default:
            if (!encoding) return buffer;else throw new TypeError('MesseyString.bytes in browser only accept "hex" and "base64" encoding.');
        }
      };
    }
  }

  var index = Object.freeze(Messup);

  return index;

}));
