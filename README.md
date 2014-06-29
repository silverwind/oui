#oui <a target="_blank" href="https://npmjs.org/package/oui"><img src="https://badge.fury.io/js/oui.svg" alt="NPM version" height="18"></a> <a target="_blank" href="https://david-dm.org/silverwind/oui"><img src="https://david-dm.org/silverwind/oui.svg" alt="Dependency Status" height="18"></a>
Lookup MAC-Adresses or their prefixes in the IEEE database.

##Installation
````bash
npm install oui
````
##Usage
````js
oui(oui, [options], callback);
oui.update(callback); // Update the database from the IEEE file
````
`options` should be an object containing options.

##Example
````js
var oui = require("oui");
oui("20-37-06", function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});
````
will print
````
CISCO SYSTEMS, INC.
170 W. TASMAN DRIVE
M/S SJA-2
SAN JOSE CA 95134-1706
UNITED STATES
````

##Options
###Strict mode
In strict mode, only these formats of MACs are accepted:
 - 00:00:00
 - 00-00-00
 - 00:00:00:00:00:00
 - 00-00-00-00-00-00
 - 0000.0000.0000

##CLI
When installed through `npm install -g oui`, this command is available:

````bash
$ oui 20-37-06
````
