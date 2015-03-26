# oui [![NPM version](https://img.shields.io/npm/v/oui.svg?style=flat)](https://www.npmjs.org/package/oui) [![Dependency Status](http://img.shields.io/david/silverwind/oui.svg?style=flat)](https://david-dm.org/silverwind/oui)
> Look up MAC addresses for their vendor in the IEEE OUI database

*Note: The module API changed to sync starting with 3.0.0*

## Installation (CLI)
```bash
$ [sudo] npm install -g oui
```
## Example (CLI)
```
$ oui 20:37:06
CISCO SYSTEMS, INC.
170 W. TASMAN DRIVE
M/S SJA-2
SAN JOSE CA 95134-1706
UNITED STATES
```
To update the local OUI database from the official IEEE source:
```bash
$ [sudo] oui --update
```

## Installation (Module)
```bash
$ npm install --save oui
```
### Example (Module)
```js
var oui = require("oui");
console.log(oui("203706"));
//=> CISCO SYSTEMS, INC.
//=> 170 W. TASMAN DRIVE
//=> M/S SJA-2
//=> SAN JOSE CA 95134-1706
//=> UNITED STATES
```

## API
### oui(input, [options]);
- `input`: The input string. Non-hexadecimal characters and characters after 6 matching characters are found are ignored.
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

© 2014-2015 [silverwind](https://github.com/silverwind), distributed under BSD licence
