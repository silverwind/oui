"use strict";

var db = require("./db.json");
var strictFormats = [
  /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/,
  /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/,
  /^([0-9A-F]{4}[.]){2}([0-9A-F]{4})$/,
  /^[0-9A-F]{6}$/,
  /^[0-9A-F]{12}$/
];

var oui = function oui(input, opts) {
  if (typeof input !== "string")
    throw new Error("Input not a string");

  input = input.toUpperCase();

  if (opts && opts.strict === true) {
    var isStrict = strictFormats.some(function(regex) {
      if (regex.test(input)) return true;
    });

    if (!isStrict)
      throw new Error("Input not in strict format");

    input = input.replace(/[.:-]/g, "").substring(0, 6);
  } else {
    input = input.replace(/[^0-9a-fA-F]/g, "").substring(0, 6);
  }

  if (input.length < 6) return null;
  return db[input] || null;
};

oui.update = function(cb) {
  require("./update.js")(false, function(err, newdb) {
    if (err) return cb(err);
    db = newdb;
    if (cb) cb(null);
  }, true);
};

module.exports = oui;
