#!/usr/bin/env node
"use strict";

const fs        = require("fs");
const got       = require("got");
const stringify = require("json-stable-stringify");
const path      = require("path");
const countries = require("country-data").countries;
const url       = require("url");
const noop      = function() {};

module.exports = function update(opts) {
  return new Promise(function(resolve, reject) {
    opts = Object.assign({
      url: "http://linuxnet.ca/ieee/oui.txt",
      file: path.join(__dirname, "oui.json"),
    }, opts);

    const uri = url.parse(opts.url);
    if (!uri.protocol || !uri.hostname) {
      return reject(new Error("Invalid source URL '" + opts.url + "'"));
    }

    got(opts.url).catch(reject).then(function(res) {
      parse(res.body.split("\n"), function(result) {
        const str = stringify(result, {space: 1, cmp: function(a, b) {
          return parseInt(a.key, 16) > parseInt(b.key, 16) ? 1 : -1;
        }});

        if (opts.test) {
          return resolve(result);
        }

        if (!opts.cli) {
          resolve(result);
          fs.writeFile(opts.file, str, noop);
        } else {
          fs.writeFile(opts.file, str, function(err) {
            if (err) reject(err);
            else resolve(result);
          });
        }
      });
    }).catch(reject);
  });
};

function isStart(firstLine, secondLine) {
  if (firstLine === undefined || secondLine === undefined) return false;
  return firstLine.trim().length === 0 && /([0-9A-F]{2}[-]){2}([0-9A-F]{2})/.test(secondLine);
}

function parse(lines, cb) {
  const result = {};
  let i = 3;
  while (i !== lines.length) {
    if (isStart(lines[i], lines[i + 1])) {
      let oui   = lines[i + 2].substring(0, 6).trim();
      let owner = lines[i + 1].replace(/\((hex|base 16)\)/, "").substring(10).trim();

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
      const shortCode = (/\n([A-Z]{2})$/.exec(owner) || [])[1];
      if (shortCode && countries[shortCode]) {
        owner = owner.replace(/\n.+$/, "\n" + countries[shortCode].name);
      }

      result[oui] = owner;
    }
  }
  if (cb) cb(result);
}
