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
  function warnIfTooBig() {
    Array.prototype.forEach.call(arguments, function (int) {
      if (int.toString().replace(/[^0-9]/g).length > 15) {
        console.warn("Number ".concat(int, " is too large/small for a precise computation because JavaScript numbers are represented in IEEE-754 binary64 format. Expect incorrect result."));
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

  var Messup = {
    fromRange: function fromRange() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var hideWarning = arguments.length > 2 ? arguments[2] : undefined;

      if (hideWarning !== true) {
        warnIfTooBig(min, max);
      }

      if (max < min) {
        throw new TypeError('The `max` argument cannot be smaller than the `min` argument.');
      }

      var diff = Math.abs(max - min); // To make upper limit inclusion possible
      // because `Math.floor` is used.

      diff += 1;
      return Math.floor(Math.random() * diff + min);
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
    hex: function hex(byte, useUpperCase) {
      throwIfInvalidLength('byte', byte);
      var str = Messup.string(byte);
      var result = '';

      try {
        result = Buffer.from(str).toString('hex');
      } catch (e) {
        for (var i = 0; i < byte; i++) {
          result += str.charCodeAt(i).toString(16);
        }
      }

      return useUpperCase === true ? result.toUpperCase() : result;
    },
    base62: function base62(length) {
      throwIfInvalidLength('character', length);
      var map = NUM.concat(UPC, LWC);
      return randomFrom(map, length);
    },
    base64: function base64(byte) {
      throwIfInvalidLength('byte', byte);
      var str = Messup.string(byte);

      try {
        return Buffer.from(str).toString('base64');
      } catch (e) {
        return window.btoa(str);
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
          return typedArray.toLocaleString() // IE does not support array methods in TypedArrays
          .split(/[^0-9]/g).map(toRadix16).join('');
        }

        function toRadix16(string) {
          var hex = Number(string).toString(16); // Conditionally leading zero
          // because leading zero is truncated by `Number(string)`

          return (hex.length === 1 ? '0' : '') + hex;
        }
      };
    }
  }

  var index = Object.freeze(Messup);

  return index;

}));
