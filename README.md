# oui [![NPM version](https://img.shields.io/npm/v/oui.svg?style=flat)](https://www.npmjs.org/package/oui) [![Dependency Status](http://img.shields.io/david/silverwind/oui.svg?style=flat)](https://david-dm.org/silverwind/oui) [![Build Status](https://api.travis-ci.org/silverwind/oui.svg?style=flat)](https://travis-ci.org/silverwind/oui)
> Look up MAC addresses for their vendor in the IEEE OUI database

## Installation
```console
$ npm i --save oui
```
## Example
```js
var oui = require("oui");
console.log(oui("20:37:06:12:34:56"));
//=> Cisco Systems, Inc
//=> 80 West Tasman Drive
//=> San Jose CA 94568
//=> United States
```

## Installation (CLI)
```console
$ npm i -g oui
```
## Example (CLI)
Either provide the lookup digits as an argument or on stdin:
```console
$ oui 20:37:06:12:34:56
Cisco Systems, Inc
80 West Tasman Drive
San Jose CA 94568
United States
```
```console
$ echo 203706 | oui
Cisco Systems, Inc
80 West Tasman Drive
San Jose CA 94568
United States
```
To update the local OUI database from the official IEEE source:
```console
$ oui --update
```

## API
### oui(input, [options])
- `input` *String*: The input string. Non-hexadecimal characters and characters after 6 hex characters are found are ignored unless `options.strict` is set.
- `options` *Object*: A optional options object.
  - `strict` *Boolean*: When `true`, only [strict input formats will be accepted](#strictformats). Will throw an error when an invalid format is supplied.
  - `file` *String*: A absolute file path to `oui.json`, which contains the parsed oui data. Defaults to the `oui.json` in the module directory.

Returns either a string, or `null` if no matches are found. Throws if input is not a string.

### oui.update([options], cb)
- `options` *Object*: A optional options object.
  - `url` *String*: The URL from where to retrieve `oui.txt`. Defaults to `'http://linuxnet.ca/ieee/oui.txt'`. To use the more inconsistent and slower to download original file from IEEE, use `'http://standards.ieee.org/develop/regauth/oui/oui.txt'`.
  - `file` *String*: A absolute file path for `oui.json`, which is used to store the parsed oui data. Defaults to. Defaults to the `oui.json` in the module directory.
- `cb` *Function*: The callback function receives `err` (if any).

<a name="strictformats" />
#### strict formats
- `000000`
- `00:00:00`
- `00-00-00`
- `000000000000`
- `0000.0000.0000`
- `00:00:00:00:00:00`
- `00-00-00-00-00-00`

© [silverwind](https://github.com/silverwind), distributed under BSD licence
