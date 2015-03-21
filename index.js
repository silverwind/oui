"use strict";

var db = require("./db.json"),
    strictFormats = [
        /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/,
        /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/,
        /^([0-9A-F]{4}[.]){2}([0-9A-F]{4})$/,
        /^[0-9A-F]{6}$/,
        /^[0-9A-F]{12}$/
    ];

var oui = function oui(input, opts, cb) {
    if (typeof opts === "function" && typeof cb === "undefined") {
        cb = opts;
        opts = null;
    }

    if (typeof input !== "string") return cb(new Error("Input not a string"));

    input = input.toUpperCase();

    if (opts && opts.strict) {
        var matched = strictFormats.some(function (regex) {
            if (regex.test(input)) return true;
        });

        if (!matched) return cb(new Error("Input not in strict format"));

        input = input.replace(/[.:-]/g, "").substring(0, 6);
    } else {
        input = input.replace(/[^0-9a-fA-F]/g, "").substring(0, 6);
    }

    if (input.length < 6) return cb(new Error("Input too short"));

    cb(null, db[input]);
};

oui.update = function (cb) {
    require("./update.js")(true, function (err, newdb) {
        if (err) return cb(err);
        db = newdb;
        cb(null);
    });
};

module.exports = oui;
