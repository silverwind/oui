#!/usr/bin/env node
"use strict";

var fs        = require("fs");
var got       = require("got");
var stringify = require("json-stable-stringify");
var path      = require("path");
var countries = require("country-data").countries;
var url       = require("url");
var noop      = function() {};

module.exports = function update(opts, cb) {
  opts = opts || {};
  opts.url = opts.url || "http://linuxnet.ca/ieee/oui.txt";
  opts.file = opts.file || path.join(__dirname, "oui.json");

  var uri = url.parse(opts.url);
  if (!uri.protocol || !uri.hostname) {
    return cb(new Error("Invalid source URL '" + opts.url + "'"));
  }

  got(opts.url).catch(cb).then(function(res) {
    parse(res.body.split("\n"), function(result) {
      var str = stringify(result, {space: 1, cmp: function(a, b) {
        return parseInt(a.key, 16) > parseInt(b.key, 16) ? 1 : -1;
      }});

      if (opts.test) {
        return cb(null, result);
      }

      if (!opts.cli) {
        cb(null, result);
        fs.writeFile(opts.file, str, noop);
      } else {
        fs.writeFile(opts.file, str, cb);
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
      owner = owner.replace(/[ \t]+/gm, " ");

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
