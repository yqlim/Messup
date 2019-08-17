# Messup <!-- omit in TOC -->

1. [Overview](#overview)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Methods](#methods)
   1. [`.number(min, max, hideWarning)`](#numbermin-max-hidewarning)
   2. [`.numberByLength(length, hideWarning)`](#numberbylengthlength-hidewarning)
   3. [`.string(length, customChars)`](#stringlength-customchars)
   4. [`.base62(length)`](#base62length)
   5. [`.base64(bytes)`](#base64bytes)
   6. [`.hex(bytes, useUpperCase)`](#hexbytes-useuppercase)
   7. [`.bytes(bytes, encoding)`](#bytesbytes-encoding)

## Overview

Messup is a JavaScript tool that can be used in both Node and browsers to generate random string or number, even [cryptographically](#bytesbytes-encoding).

| Method            |          Return Type           | Crypto |
| :---------------- | :----------------------------: | :----: |
| `.number`         |            `number`            |   No   |
| `.numberByLength` |            `number`            |   No   |
| `.string`         |            `string`            |   No   |
| `.base62`         |            `string`            |   No   |
| `.base64`         |            `string`            |   No   |
| `.hex`            |            `string`            |   No   |
| `.bytes`          | `string \| Buffer \| Uint8Array` |  Yes   |

### Support <!-- omit in TOC -->

#### Node <!-- omit in TOC -->

_All stable Node versions._

#### Browser <!-- omit in TOC -->

| Browser | Version (>=) |
|:--------|:-------:|
| Chrome | 11 |
| Edge | 12 |
| Firefox | 26 |
| Internet Explorer | 11 |
| Opera | 15 |
| Safari | 6.1 |
| Android Webview | _Yes_ |
| Chrome for Android | 18 |
| Firefox for Android | 26 |
| Opera for Android | 14 |
| Safari on iOS | 6.1 |
| Samsung Internet | _Yes_ |

## Installation

```
npm install --save messup
```

## Usage

Messup is not a class or constructor. It is only an object containing methods.

Node or Browser (with framework):

```javascript
// Require the package
const Messup = require('messup');

// Require and destruct the package
const { number, hex, base64 } = require('messup');

/* OR */

// Import the package
import Messup from 'messup'

// Import and destruct the package
import { string, base62, bytes } from 'messup'
```

Browser (without framework):

```html
<script src="path/to/messup/index.min.js"></script>
<script>
<!-- Package will expose `Messup` to `window` -->
Messup.base62(...);
Messup.string(...);
</script>
```

## Methods

All methods are synchronous.

### `.number(min, max, hideWarning)`

Randomly generates a number from the specified range. Both `min` and `max` are inclusive in the generation.

As JavaScript numbers are represented in IEEE-754 binary64 format, numbers with more than 15 digits cannot be precisely computed. A warning will be printed to console when this happens.

This method is not cryptographically secure.

#### Parameters <!-- omit in TOC -->

| Parameter | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| min | Number | 0 | Mininum possible number. |
| max | Number | 1 | Maximum possible number. |
| hideWarning | Boolean | - | Set to `true` to hide large number warning. |

#### Return value <!-- omit in TOC -->

A random `number` from `min` to `max`.

### `.numberByLength(length, hideWarning)`

Randomly generates a number by specifying the result length.

As JavaScript numbers are represented in IEEE-754 binary64 format, numbers with more than 15 digits cannot be precisely computed. A warning will be printed to console when this happens.

This method is not cryptographically secure.

#### Parameters <!-- omit in TOC -->

| Parameter | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| length | Number | - | Specify the expected length to be generated. |
| hideWarning | Boolean | - | Set to `true` to hide large number warning. |

#### Return value <!-- omit in TOC -->

A random `number` with the specified length.

### `.string(length, customChars)`

Randomly generates a string with the specified length.

By default, all non-empty characters that are typable from a normal keyboard are included in the generation.

Default character set:

    !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~

The default character set can be overriden by specifying your own character set in `customChars` parameter.

This method is not cryptographically secure.

#### Parameters <!-- omit in TOC -->

| Parameter | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| length | Number | - | Specify the expected length to be generated. |
| customChars | String | - | Specify the custom character set to override the default set. |

#### Return value <!-- omit in TOC -->

A random `string` with the specified length.

### `.base62(length)`

Randomly generates a string with the specified length with only base62 character sets.

Characters within the base62 range can be used safely on the web without further encoding. It can ideally be used to generate a non-security related random ID.

This method is not cryptographically secure.

#### Parameters <!-- omit in TOC -->

| Parameter | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| length | Number | - | Specify the expected length to be generated. |

#### Return value <!-- omit in TOC -->

A set of random numbers encoded to base64 `string`.

### `.base64(bytes)`

Randomly generates N bytes of base64 encoded string.

Internally, this method generates a random number from 0 to 255 to be base64 encoded.

This method is not cryptographically secure.

#### Parameters <!-- omit in TOC -->

| Parameter | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| bytes | Number | - | Specify the expected bytes to be generated. |

#### Return value <!-- omit in TOC -->

A set of random numbers encoded to base64 `string`.

### `.hex(bytes, useUpperCase)`

Randomly generates N bytes of hex encoded string. Each byte will contain 2 hex characters.

Internally, this method generates a random number from 0 to 255 to be hex encoded.

By default, the result will be generated using lowercase characters. To generate in uppercase characters, use the `useUpperCase` paramater.

This method is not cryptographically secure.

#### Parameters <!-- omit in TOC -->

| Parameter | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| bytes | Number | - | Specify the expected bytes to be generated. |
| useUpperCase | Boolean | - | Set to `true` to use uppercase characters. |

#### Return value <!-- omit in TOC -->

A set of random numbers encoded to hexadecimal `string`.

### `.bytes(bytes, encoding)`

Randomly generates N bytes of cryptographically secure buffer or string. 

This method uses [Node's Crypto module](https://nodejs.org/api/crypto.html) in Node or [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) in browsers.

Supported encoding:

| Encoding | Node | Browser |
|:--------:|:----:|:-------:|
| hex | &#x2714; | &#x2714; |
| base64 | &#x2714; | &#x2714; |
| ascii | &#x2714; | &#10060; |
| utf8 | &#x2714; | &#10060; |
| utf16le | &#x2714; | &#10060; |
| ucs2 | &#x2714; | &#10060; |
| latin1 | &#x2714; | &#10060; |
| binary | &#x2714; | &#10060; |

#### Parameters <!-- omit in TOC -->

| Parameter | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| bytes | Number | - | Specify the expected bytes to be generated. |
| encoding | String | - | Specify the encoding to be used. |

#### Return value <!-- omit in TOC -->

If `encoding` is specified, returns a encoded `string`.

Otherwise, `Buffer` is returned in Node, or `Uint8Array` is returned in browser.
