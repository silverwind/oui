#oui [![NPM version](https://img.shields.io/npm/v/oui.svg)](https://www.npmjs.org/package/oui) [![Dependency Status](https://david-dm.org/silverwind/oui.svg)](https://david-dm.org/silverwind/oui)

Lookup MAC adresses or their prefixes in the IEEE database.

##Installation
###CLI
```bash
$ [sudo] npm install -g oui
```
###Module
```bash
$ npm install oui
```
##Usage
###CLI
```bash
$ oui 20:37:06
```
will print:
```
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
###Module
```js
var oui = require("oui");
oui(input, [options], callback);
```
- `input`: The input string. Can be pretty much any format as long as 6 charactes containing hexadecimal are provided.
- `options`: An object containing module [options](#options).
- `callback`: The callback function receives `err` (if any) and `result`.

To update the local OUI database from the official IEEE source:
```js
oui.update(callback);
```
- `callback`: The callback function receives `err` (if any).

####Example
```js
var oui = require("oui");
oui("20:37:06", function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
```

<a name="options" />
##Options
`options` is an object containing below (optional) options:

###strict
```js
oui(input, {strict: true}, callback);
```
In strict mode, only these formats of MACs are accepted:
- 000000
- 00:00:00
- 00-00-00
- 000000000000
- 0000.0000.0000
- 00:00:00:00:00:00
- 00-00-00-00-00-00
