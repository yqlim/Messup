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
      if (int.toString().replace(/[^0-9]/g).length > 15) {
        console.warn("Number ".concat(int, " is cannot be computed precisely because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result."));
      }
    });
  }
  function randomFrom(list, resultLength) {
    var listLength = list.length;
    var ret = '';

    while (resultLength--) {
      ret += list[Math.floor(Math.random() * listLength)];
    }

    return ret;
  }
  function forEach(iterable, callback, context) {
    Array.prototype.forEach.call(iterable, callback, context);
  }
  function leftPad(str, expectedLength, pad) {
    var len = str.length;
    if (len >= expectedLength) return str;

    for (var i = 0; i < len; i++) {
      str = pad + str;
    }

    return str;
  }
  function inclusiveRangeRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var Messup = {
    fromRange: function fromRange() {
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
    number: function number(length) {
      throwIfInvalidLength('character', length);
      var result = randomFrom(NUM, length);
      return parseInt(result);
    },
    string: function string(length) {
      throwIfInvalidLength('character', length);
      var ret = '';

      while (length--) {
        ret += String.fromCharCode(Messup.fromRange(CHARCODE_OF_KEYBOARD_CHARS_LOWEST, CHARCODE_OF_KEYBOARD_CHARS_HIGHEST));
      }

      return ret;
    },
    hex: function hex(bytes, useUpperCase) {
      throwIfInvalidLength('byte', bytes);
      var result = '';

      for (var i = 0; i < bytes; i++) {
        result += leftPad(inclusiveRangeRandom(0, 255).toString(16), 2, 0);
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
        result += String.fromCharCode(inclusiveRangeRandom(0, 255));
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

        var array = new Uint8Array(bytes);
        window.crypto.getRandomValues(array);

        switch (encoding) {
          case 16:
          case 'hex':
            return toHex(array);

          case 64:
          case 'base64':
            return window.btoa(String.fromCharCode.apply(String, array));

          default:
            if (!encoding) return array;else throw new TypeError('MesseyString.bytes in browser only accept "hex" and "base64" encoding.');
        }

        function toHex(typedArray) {
          var len = typedArray.length;
          var ret = '';

          for (var i = 0; i < len; i++) {
            ret += toRadix16(typedArray[i]);
          }

          return ret;
        }

        function toRadix16(string) {
          var hex = Number(string).toString(16); // Conditionally add leading zero
          // because leading zero is truncated by `Number(string)`

          return (hex.length === 1 ? '0' : '') + hex;
        }
      };
    }
  }

  var index = Object.freeze(Messup);

  return index;

}));
