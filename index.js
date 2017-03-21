"use strict";

var db;
const strictFormats = [
  /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i,
  /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/i,
  /^([0-9A-F]{4}[.]){2}([0-9A-F]{4})$/i,
  /^[0-9A-F]{6}$/i,
  /^[0-9A-F]{12}$/i
];

var oui = module.exports = function oui(input, opts) {
  if (typeof input !== "string")
    throw new Error("Input not a string");

  opts = Object.assign({}, opts);

  if (!db) {
    db = require(opts.file || "./oui.json");
  }

  input = input.toUpperCase();

  if (opts.strict === true) {
    const isStrict = strictFormats.some(function(regex) {
      if (regex.test(input)) return true;
    });

    if (!isStrict) {
      throw new Error("Input not in strict format");
    }

    input = input.replace(/[.:-]/g, "").substring(0, 6);
  } else {
    input = zeroPad(input).replace(/[^0-9a-fA-F]/g, "").substring(0, 6);
  }

  if (input.length < 6) return null;
  return db[input] || null;
};

// Zero-pad colon notation as seen in BSD `arp`. eg. 1:2:3 should become 01:02:03
function zeroPad(str) {
  if (!/^[0-9A-F:]+$/.test(str)) return str;
  return str.split(":").map(part => part.length === 1 ? "0" + part : part).join(":");
}

oui.update = function(opts) {
  return new Promise(function(resolve, reject) {
    opts = Object.assign({cli: false}, opts);
    require("./update.js")(opts).then(function(newdb) {
      db = newdb;
      resolve();
    }).catch(reject);
  });
};
