#!/usr/bin/env node
"use strict";

var fs        = require("fs");
var got       = require("got");
var stringify = require("json-stable-stringify");
var dbPath    = require("path").join(__dirname, "db.json");
var countries = require("country-data").countries;
var source    = "http://standards.ieee.org/develop/regauth/oui/oui.txt";

module.exports = function update(isCLI, cb) {
  got(source).catch(cb).then(function (res) {
    parse(res.body.split("\n"), function (result) {
      var str = stringify(result, {space: 1, cmp: function (a, b) {
        return parseInt(a.key, 16) > parseInt(b.key, 16) ? 1 : -1;
      }});
      if (!isCLI) {
        cb(null, result);
        fs.writeFile(dbPath, str);
      } else {
        fs.writeFile(dbPath, str, cb);
      }
    });
  });
};

function isStart(firstLine, secondLine) {
  if (firstLine === undefined || secondLine === undefined) return false;
  return firstLine.trim().length === 0 && /([0-9A-F]{2}[-]){2}([0-9A-F]{2})/.test(secondLine);
}

function parse(lines, cb) {
  var result = {}, i = 3;
  while (i !== lines.length) {
    if (isStart(lines[i], lines[i + 1])) {
      var oui   = lines[i + 2].substring(0, 6).trim();
      var owner = lines[i + 1].replace(/\((hex|base 16)\)/, "").substring(10).trim();

      i += 3;
      while (!isStart(lines[i], lines[i + 1]) && i < lines.length) {
        if (lines[i] && lines[i].trim()) owner += "\n" + lines[i].trim();
        i++;
      }

      // ensure upper case on hex digits
      oui = oui.toUpperCase();

      // remove excessive whitespace
      owner = owner.replace(/[\ \t]+/gm, " ");

      // replace country shortcodes
      var shortCode = (/\n([A-Z]{2})$/.exec(owner) || [])[1];
      if (shortCode && countries[shortCode]) {
        owner = owner.replace(/\n.+$/, "\n" + countries[shortCode].name);
      }

      result[oui] = owner;
    }
  }
  if (cb) cb(result);
}
