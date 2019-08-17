const chai = require('chai');
const expect = chai.expect;
chai.should();


const Messup = require('./../lib');


const it_should_throw_if_length_is_not_number = function(method, ...args){
  it('should throw if length/byte is not a number.', function(){
    expect(Messup[method].bind(Messup, '1', ...args)).to.throw(TypeError, /must be specified with a positive integer/);
  });
};

const it_should_throw_if_length_is_less_than_1 = function(method, ...args){
  it('should throw if length/byte is less than 1.', function(){
    expect(Messup[method].bind(Messup, 0, ...args)).to.throw(RangeError, /cannot generate less than 1/i);
  });
};

const it_should_return_type = function(type, method, ...args){
  it(`should return type ${type}.`, function(){
    expect(typeof Messup[method].call(Messup, ...args)).to.equal(type);
  });
};

const it_should_generate_correct_length = function(method, ...args){
  it('should generate correct length.', function(){
    return new Promise((res, rej) => {
      for (let i = 1; i <= 100; i++){
        if (Messup[method].call(Messup, i, ...args).length !== i)
          rej(new Error('Generated length does not match the requested length.'));
      }
      res();
    });
  });
}


describe('Messup', function(){

  const methods = [
    'number',
    'numberByLength',
    'string',
    'hex',
    'base62',
    'base64',
    'bytes'
  ];

  const thrower = function(){ throw new TypeError('Method is writable/configurable.'); };

  it('methods should be enumerable.', function(){
    let i = 0;
    for (const _ in Messup){
      i++;
    }
    expect(i).to.be.greaterThan(0);
  });

  it('methods should not be wriable.', function(){
    for (const method in Messup){
      if (Messup[method] !== null){
        Messup[method] = thrower;
        expect(Messup[method]).to.not.throw(TypeError, 'Method is writable.');
      }
    }
  });

  it('methods should not be configurable.', function(){
    const runner = function(){
      for (const method in Messup){
        if (Messup[method] !== null){
          Object.defineProperty(Messup, method, { value: thrower });
        }
      }
    };
    expect(runner).to.throw();
  });

  describe('.number', function(){

    const isInclusive = (min, max) => {
      const hist = [];
      const count = (max - min) + 1;

      while (true){
        const val = Messup.number(min, max);

        if (!hist.includes(val))
          hist.push(val);

        if (hist.length === count)
          return true;
      }
    }

    it_should_return_type('number', 'number', 0, 1);

    it('should return correct value when no arguments are given.', function(){

      const runner = function(){
        const hist = [];
        const count = (1 - 0) + 1;
  
        while (true){
          const val = Messup.number();
  
          if (!hist.includes(val))
            hist.push(val);
  
          if (hist.length === count)
            return true;
        }
      };

      expect(runner()).to.equal(true);

    });

    it('should be inclusive to the `min` and `max` arguments.', function(){
      expect(isInclusive(0, 100)).to.equal(true);
    });

    it('should run correctly with negative `min` and/or `max`.', function(){
      expect(isInclusive(-100, 100)).to.equal(true);
    });

    it('should throw if `min` and/or `max` is not integer.', function(){

      const binder = (min, max) => Messup.number.bind(Messup, min, max, true);
      const check = params => {
        params.forEach(([min, max]) => {
          expect(binder(min, max)).to.throw(TypeError, /not an integer/);
        });
      }

      check([
        ['0', 1],
        [1.1, 2],
        [0, '1'],
        [1, 2.1],
        [1.1, '2'],
        ['1', 2.2],
        ['1', '2']
      ]);

    });

    it('should throw if `max` is smaller than `min`.', function(){
      expect(Messup.number.bind(Messup, 1, 0)).to.throw(TypeError, /cannot be smaller/);
    });

  });

  describe('.numberByLength', function(){

    it_should_throw_if_length_is_not_number('numberByLength');
    it_should_throw_if_length_is_less_than_1('numberByLength');
    it_should_return_type('number', 'numberByLength', 1);

    it('should return correct length.', function(){

      const checkLength = (a, b) => a === b;

      // Check until 15 chars only. See src `console.warn`.
      for (let i = 1; i <= 15; i++){
        const result = Messup.numberByLength(i, true).toString();
        expect(checkLength(result.length, i)).to.equal(true);
      }

    });

  });

  describe('.string', function(){

    it_should_throw_if_length_is_not_number('string');
    it_should_throw_if_length_is_less_than_1('string');
    it_should_return_type('string', 'string', 1);
    it_should_generate_correct_length('string');

    it('should use the `customCharSet` to compute result.', function(){

      const customCharSet = '1qaz';
      const runner = customCharSet => {
        const result = Messup.string(50, customCharSet);
        return new RegExp(`[^${customCharSet}]`).test(result);
      };

      expect(runner(customCharSet)).to.equal(false);

    });

    it('should use the correct default character set to compute result.', function(){
      return new Promise((res, rej) => {

        // charCode 33 to 126 are non-empty characters typable from keyboard
        const charCodeMin = 33;
        const charCodeMax = 126;
        const defaultSet = (function(from, to){
          let ret = [];
          for (let i = from; i <= to; i++){
            ret.push(String.fromCharCode(i));
          }
          return ret;
        })(charCodeMin, charCodeMax);
  
        const result = Messup.string((charCodeMax - charCodeMin + 1) * 10);
  
        for (let i = 0; i < result.length; i++)
          if (!defaultSet.includes(result[i]))
            rej(new TypeError(`Character "${result[i]}" is not within the default chatacter set.`));

        res();

      });
    });

  });

  describe('.hex', function(){

    it_should_throw_if_length_is_not_number('hex');
    it_should_throw_if_length_is_less_than_1('hex');
    it_should_return_type('string', 'hex', 1);

    const hexCharsL = /^[0-9a-f]{2,}$/g;
    const hexCharsU = /^[0-9A-F]{2,}$/g;

    it('should return only hex digits.', function(){
      expect(hexCharsL.test(Messup.hex(256))).to.equal(true);
    });

    it('should return uppercase hex characters if arguments[1] equals true.', function(){
      expect(hexCharsU.test(Messup.hex(256, true))).to.equal(true);
    });

    it('should always return length of byte * 2.', function(){
      return new Promise((res, rej) => {
        for (let i = 1; i <= 100; i++){
          if (Messup.hex(i).length !== i * 2)
            rej();
        }
        res();
      });
    });

  });

  describe('.base62', function(){

    it_should_throw_if_length_is_not_number('base62');
    it_should_throw_if_length_is_less_than_1('base62');
    it_should_return_type('string', 'base62', 1);
    it_should_generate_correct_length('base62');

    it('should return base62 character set only.', function(){
      return new Promise((res, rej) => {
        const invalidChars = /^[^0-9A-Za-z]$/g
        for (let i = 1; i <= 100; i++){
          if (invalidChars.test(Messup.base62(i)))
            rej(new TypeError('Invalid characters are generated.'));
        }
        res();
      });
    });

  });

  describe('.base64', function(){

    it_should_throw_if_length_is_not_number('base64');
    it_should_throw_if_length_is_less_than_1('base64');
    it_should_return_type('string', 'base64', 1);

    const base64Chars = /^[0-9A-Za-z\+\=\/]{4,}$/g

    it('should return only base64 digits.', function(){
      expect(base64Chars.test(Messup.base64(256))).to.equal(true);
    });

    it('should always return length dividable by 4.', function(){
      return new Promise((res, rej) => {
        for (let i = 1; i <= 100; i++){
          if (Messup.base64(i).length % 4 !== 0)
            rej(new TypeError('Result with invalid length is generated.'));
        }
        res();
      });
    });

  });

  describe('.bytes', function(){

    it_should_throw_if_length_is_not_number('base64');
    it_should_throw_if_length_is_less_than_1('base64');

    it('should return Buffer if arguments[1] is empty.', function(){
      expect(Messup.bytes(1).constructor).to.equal(Buffer);
    });

    it('should return not throw if valid arguments[1] is given.', function(){

      const encodings = [
        'ascii',
        'utf8',
        'utf16le',
        'ucs2',
        'base64',
        'latin1',
        'binary',
        'hex'
      ];

      encodings.forEach(encoding => {
        expect(Messup.bytes.bind(Messup, 1, encoding)).to.not.throw();
      });

    });

    it('should throw if invalid arguments[1] is given as string.', function(){

      const encodings = [
        '',
        'abc'
      ];

      encodings.forEach(encoding => {
        expect(Messup.bytes.bind(Messup, 1, encoding)).to.throw(TypeError, /(unsupported|unknown) encoding/i);
      });

    });

    it('should ignore invalid arguments[1] if it is given as anything but string.', function(){

      const encodings = [
        true,
        {},
        [],
        Symbol(),
        () => {},
        1
      ];

      encodings.forEach(encoding => {
        expect(Messup.bytes(1, encoding).constructor).to.equal(Buffer);
      });

    });

  });

});
