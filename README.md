#oui [![NPM version](https://img.shields.io/npm/v/oui.svg)](https://www.npmjs.org/package/oui) [![Dependency Status](https://david-dm.org/silverwind/oui.svg)](https://david-dm.org/silverwind/oui)

Lookup MAC adresses or their prefixes in the IEEE database.

##Installation
````bash
npm install oui
````
##Usage
````js
var oui = require("oui");
oui(input, [options], callback);
````
- `input`: The input string. Can be pretty much any format as long as 6 charactes containing hexadecimal are provided.
- `options`: An object containing module [options](#options).
- `callback`: The callback function receives `err` (if any) and `result`.

To update the local database from the official IEEE source:
````js
oui.update(callback);
````
- `callback`: The callback function receives `err` (if any).

##Example
````js
var oui = require("oui");
oui("20:37:06", function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});
````
will print:
````
CISCO SYSTEMS, INC.
170 W. TASMAN DRIVE
M/S SJA-2
SAN JOSE CA 95134-1706
UNITED STATES
````

<a name="options" />
##Options
`options` is an object containing below (optional) options:

###strict
````js
oui(input, {strict: true}, callback);
````
In strict mode, only these formats of MACs are accepted:
 - 00:00:00
 - 00-00-00
 - 00:00:00:00:00:00
 - 00-00-00-00-00-00
 - 0000.0000.0000

##CLI
When installed through `npm install -g oui`, the `oui` command is available:

````bash
$ oui 20:37:06
````

To update the database, run:

````bash
$ oui --update
````
