#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const url = require("node:url");
const csv = require('csv-parse/sync');

const countries = require("country-data").countries;
const fetch = require("fetch-enhanced")(require("node-fetch"));
const stringify = require("json-stable-stringify");

const stringifyOpts = {
  space: 1,
  cmp: (a, b) => {
    return parseInt(a.key, 16) > parseInt(b.key, 16) ? 1 : -1;
  },
};

module.exports = function update(opts) {
  return new Promise((resolve, reject) => {
    opts = {url: "https://standards-oui.ieee.org/oui/oui.csv",
      file: path.join(__dirname, "oui.json"), ...opts};

    const uri = url.parse(opts.url);
    if (!uri.protocol || !uri.hostname) {
      return reject(new Error(`Invalid source URL '${opts.url}'`));
    }

    fetch(opts.url).then(res => res.text()).then(body => {
      if (!body || !body.length || !/^([\w ]+,){3}/.test(body)) {
        throw new Error("Downloaded file does not look like a oui.csv file");
      } else {
        return parse(body);
      }
    }).then(result => {
      if (opts.test) return resolve(result);

      // save oui.json
      fs.writeFile(opts.file, stringify(result, stringifyOpts), err => {
        if (err) return reject(err);
        resolve(result);
      });
    }).catch(reject);
  });
};

function parse(text) {
  const result = {};
  let oui_csv = csv.parse(text, {
    skip_empty_lines: true
  });

  // remove columns name
  oui_csv.shift();

  for (const line of oui_csv) {
    // console.log(line);
    let oui = line[1].toUpperCase();
    let owner = line[2].trim() + "\n" + line[3].trim();

    // remove excessive whitespace
    owner = owner.replace(/[ \t]+/g, " ");

    // replace country shortcodes
    // const shortCode = (/\n([A-Z]{2})$/.exec(owner) || [])[1];
    // if (shortCode && countries[shortCode]) {
    //   owner = owner.replace(/\n.+$/, `\n${countries[shortCode].name}`);
    // }

    result[oui] = owner;
  }
  return result;
}
