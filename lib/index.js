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
  var SYM = '+/=';
  var MAX_SAFE_INTEGER = 9007199254740991;
  var CHARCODE_OF_KEYBOARD_CHARS_LOWEST = 33;
  var CHARCODE_OF_KEYBOARD_CHARS_HIGHEST = 126;

  function throwIfInvalidLength(length) {
    if (typeof length !== 'number') throw new TypeError('Length must be specified with a positive integer.');
    if (length < 1) throw new RangeError('Cannot generate less than 1 character.');
  }
  function throwIfInvalidBytes(byteLength) {
    if (typeof byteLength !== 'number') throw new TypeError('Length must be specified with a positive integer.');
    if (byteLength < 1) throw new RangeError('Cannot generate less than 1 byte.');
  }
  function randomFrom(list, resultLength) {
    throwIfInvalidLength(resultLength);
    var listLength = list.length;
    var ret = '';

    while (resultLength--) {
      ret += list[Math.floor(Math.random() * listLength)];
    }

    return ret;
  }

  var Messup = {
    fromRange: function fromRange() {
      var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_SAFE_INTEGER;
      var diff = Math.abs(to - from);
      return Math.floor(Math.random() * (diff + 1) + from);
    },
    number: function number(length, parseAsNumber) {
      var ret = randomFrom(NUM, length);
      return parseAsNumber === true ? parseInt(ret) : ret;
    },
    string: function string(length) {
      throwIfInvalidLength(length);
      var ret = '';

      while (length--) {
        ret += String.fromCharCode(Messup.fromRange(CHARCODE_OF_KEYBOARD_CHARS_LOWEST, CHARCODE_OF_KEYBOARD_CHARS_HIGHEST));
      }

      return ret;
    },
    hex: function hex(length, useUpperCase) {
      var map = NUM.concat(useUpperCase === true ? UPC : LWC);
      return randomFrom(map, length);
    },
    base62: function base62(length) {
      var map = NUM.concat(UPC, LWC);
      return randomFrom(map, length);
    },
    base64: function base64(length) {
      var map = NUM.concat(UPC, LWC, SYM);
      return randomFrom(map, length);
    }
  };

  try {
    var _require = require('crypto'),
        randomBytes = _require.randomBytes;

    Messup.bytes = function bytes(bytes, encoding) {
      throwIfInvalidBytes(bytes);
      var ret = randomBytes(bytes);
      return typeof encoding === 'string' ? ret.toString(encoding) : ret;
    };
  } catch (e) {
    if (!(window && window.crypto && typeof window.crypto.getRandomValues === 'function')) Messup.bytes = null;else {
      Messup.bytes = function bytes(bytes, encoding) {
        throwIfInvalidBytes(bytes);
        var array = new Uint8Array(bytes);
        window.crypto.getRandomValues(array);

        switch (encoding) {
          case void 0:
            return array;

          case 'hex':
            return toHex(array);

          case 'base64':
            return window.btoa(String.fromCharCode.apply(String, array));

          default:
            throw new TypeError('MesseyString.bytes in browser only accept "hex" and "base64" encoding.');
        }

        function toHex(typedArray) {
          return typedArray.toLocaleString() // IE does not support array methods in TypedArrays
          .split(/[^0-9]/g).map(toRadix16).join('');
        }

        function toRadix16(string) {
          var hasLeadingZero = string[0] === '0';
          var hex = Number(string).toString(16);
          return (hasLeadingZero ? '0' : '') + hex;
        }
      };
    }
  }

  var index = Object.freeze(Messup);

  return index;

}));
