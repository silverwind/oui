# oui
[![](https://img.shields.io/npm/v/oui.svg?style=flat)](https://www.npmjs.org/package/oui) [![](https://img.shields.io/npm/dm/oui.svg)](https://www.npmjs.org/package/oui) [![](https://api.travis-ci.org/silverwind/oui.svg?style=flat)](https://travis-ci.org/silverwind/oui)
> Look up MAC addresses for their vendor in the IEEE OUI database

The data used in this module comes from the [Sanitized IEEE OUI Data](http://linuxnet.ca/ieee/oui/) which is updated once a week on Sunday. The module is able self-update the data on user request. It's also possible to use the more frequently updated original IEEE source when preferred.

## Installation
```console
$ npm install --save oui
```
## Example
```js
var oui = require('oui');
console.log(oui('20:37:06:12:34:56'));
//=> Cisco Systems, Inc
//=> 80 West Tasman Drive
//=> San Jose CA 94568
//=> United States
console.log(oui.search('*Juniper Systems*'))
//=> [
//=>   {
//=>     oui: '0C0535',
//=>     organization: 'Juniper Systems\n1132 W. 1700 N.\nLogan UT 84321\nUnited States'
//=>   }
//=> ]
```

## Installation (CLI)
```console
$ npm install -g oui
```
## Examples (CLI)
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
```console
$ oui --search cisco theory
OUI       ORGANZATION          ADDRESS             COUNTRY
000C41    Cisco-Linksys LLC    121 Theory Dr.      Irvine CA 92612
000F66    Cisco-Linksys LLC    121 Theory Dr.      Irvine CA 92612
001217    Cisco-Linksys LLC    121 Theory Dr.      Irvine CA 92612
001310    Cisco-Linksys LLC    121 Theory Dr.      Irvine CA 92612
...
```
To update the local OUI database:
```console
$ oui --update
```
Or from the original IEEE source (slow):
```console
$ oui --update http://standards.ieee.org/develop/regauth/oui/oui.txt
```

## API
### oui(input, [options])
- `input` *string*: The input string. Non-hexadecimal characters and characters after 6 hex characters are found are ignored unless `options.strict` is set.
- `options` *Object*: A optional options object.
  - `strict` *boolean*: When `true`, only [strict input formats will be accepted](#strictformats). Will throw an error when an invalid format is supplied.
  - `file` *string*: A absolute file path to `oui.json`, which contains the parsed oui data. Defaults to the `oui.json` in the module directory.

Returns: Either a string, or `null` if no matches are found. Throws if input is not a string.

### oui.update([options])
- `options` *Object*: A optional options object.
  - `url` *string*: The URL from where to retrieve `oui.txt`. Defaults to `'http://linuxnet.ca/ieee/oui.txt'`. To use the more inconsistent and slower to download original file from IEEE, use `'http://standards.ieee.org/develop/regauth/oui/oui.txt'`.
  - `file` *string*: A absolute file path for `oui.json`, which is used to store the parsed oui data. Defaults to. Defaults to the `oui.json` in the module directory.

Returns: A Promise that indicates when the internal database has been updated. Rejects on error.

### oui.search(patterns [, options])
- `patterns` *string/Array*: One or more wildcard patterns to search the vendor data, as suppored by [minimatch](https://github.com/isaacs/minimatch).
- `options` *Object*: A optional options object.
  - `file` *String*: A absolute file path for `oui.json`, which is used to store the parsed oui data. Defaults to. Defaults to the `oui.json` in the module directory.
  - All [minimatch options](https://github.com/isaacs/minimatch#options) are supported as well.

Returns a array of objects in the format {oui, organization}.
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
