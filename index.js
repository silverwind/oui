"use strict";

var db;
var strictFormats = [
  /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i,
  /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/i,
  /^([0-9A-F]{4}[.]){2}([0-9A-F]{4})$/i,
  /^[0-9A-F]{6}$/i,
  /^[0-9A-F]{12}$/i
];

var oui = function oui(input, opts) {
  if (typeof input !== "string")
    throw new Error("Input not a string");

  opts = Object.assign({}, opts);

  if (!db) {
    db = require(opts.file || "./oui.json");
  }

  input = input.toUpperCase();

  if (opts.strict === true) {
    var isStrict = strictFormats.some(function(regex) {
      if (regex.test(input)) return true;
    });

    if (!isStrict) {
      throw new Error("Input not in strict format");
    }

    input = input.replace(/[.:-]/g, "").substring(0, 6);
  } else {
    input = input.replace(/[^0-9a-fA-F]/g, "").substring(0, 6);
  }

  if (input.length < 6) return null;
  return db[input] || null;
};

oui.update = function(opts) {
  return new Promise(function(resolve, reject) {
    opts = Object.assign({cli: false}, opts);
    require("./update.js")(opts).then(function(newdb) {
      db = newdb;
      resolve();
    }).catch(reject);
  });
};

module.exports = oui;
