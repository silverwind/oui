#!/usr/bin/env node
"use strict";

process.title = "oui";

var db     = require("./db.json"),
    path   = require("path"),
    fs     = require("fs"),
    spin   = require("char-spinner"),
    isCLI  = require.main === module,
    dbPath = path.join(__dirname + "/db.json"),
    source = "http://standards.ieee.org/develop/regauth/oui/oui.txt",
    strictFormats = [
        /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/,
        /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/,
        /^([0-9A-F]{4}[.]){2}([0-9A-F]{4})$/,
        /^[0-9A-F]{6}$/,
        /^[0-9A-F]{12}$/
    ];

function oui(input, opts, cb) {
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
}

oui.update = function (cb) {
    var interval;
    if (isCLI) interval = spin();

    require("got")(source, function (err, body) {
        if (isCLI) {
            if (interval) clearInterval(interval);
            spin.clear();
            if (err) return process.stdout.write(err);
        } else {
            if (err) return cb(err);
        }

        parse(body.split("\n"), function (result) {
            fs.writeFile(dbPath, JSON.stringify(result, null, 4), function () {
                if (cb) cb();
            });
        });
    });
};

function isStart(firstLine, secondLine) {
    if (firstLine === undefined || secondLine === undefined) return false;
    return firstLine.trim().length === 0 && /([0-9A-F]{2}[-]){2}([0-9A-F]{2})/.test(secondLine);
}

function parse(lines, cb) {
    var result = {}, i = 6;
    while (i !== lines.length) {
        if (isStart(lines[i], lines[i + 1])) {
            var oui   = lines[i + 2].substring(2, 10).trim(),
                owner = lines[i + 1].replace(/\((hex|base 16)\)/, "").substring(10).trim();

            i += 3;
            while (!isStart(lines[i], lines[i + 1]) && i < lines.length) {
                if (lines[i] && lines[i].trim()) owner += "\n" + lines[i].trim();
                i++;
            }
            result[oui] = owner;
        }
    }
    if (cb) cb(result);
}

if (isCLI && process.argv.length >= 2) {
    var arg = process.argv[2];
    if (arg === "--update") {
        oui.update(function (err) {
            if (err) process.stdout.write(err + "\n");
            process.exit(err ? 1 : 0);
        });
    } else if (!arg || arg === "--help") {
        process.stdout.write([
            "",
            "  Usage: oui mac [options]",
            "",
            "  Options:",
            "",
            "    --help      display this help",
            "    --update    update the database",
            "",
            ""
        ].join("\n"));
        process.exit(1);
    } else {
        oui(arg, function (err, result) {
            if (err) {
                process.stdout.write(err.message + "\n");
                process.exit(1);
            } else {
                if (result) {
                    process.stdout.write(result + "\n");
                } else {
                    process.stdout.write(arg + " not found in database\n");
                }
                process.exit(0);
            }
        });
    }
}

exports = module.exports = oui;
