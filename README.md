# oui [![NPM version](https://img.shields.io/npm/v/oui.svg?style=flat)](https://www.npmjs.org/package/oui) [![Dependency Status](http://img.shields.io/david/silverwind/oui.svg?style=flat)](https://david-dm.org/silverwind/oui)
> Look up MAC addresses for their vendor in the IEEE OUI database

## Installation
```console
$ npm i --save oui
```
## Example
```js
var oui = require("oui");
console.log(oui("20:37:06:11:22:33"));
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
### oui(input, [options]);
- `input`: The input string. Non-hexadecimal characters and characters after 6 hex characters are found are ignored unless `options.strict` is set.
- `options`: An optional [options](#options) object.

Returns either a string, or `null` if no matches are found. Throws if input is not a string.

### oui.update(cb);
- `cb`: The callback function receives `err` (if any).

<a name="options" />
#### options.strict
If `true`, only these formats of MACs are accepted:
- 000000
- 00:00:00
- 00-00-00
- 000000000000
- 0000.0000.0000
- 00:00:00:00:00:00
- 00-00-00-00-00-00

A lookup will throw when an invalid format is supplied strict mode.

© [silverwind](https://github.com/silverwind), distributed under BSD licence
