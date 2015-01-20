#!/usr/bin/env node
"use strict";

var db,
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

    if (opts && opts.strict) {
        var matched;
        input = input.toUpperCase();
        matched = strictFormats.some(function (regex) {
            if (regex.test(input)) return true;
        });
        if (!matched)
            return cb(new Error("Input '" + input + "' " + "violates strict mode."));
        input = input.replace(/[.:-]/g, "").substring(0, 6);
    } else {
        input = input.replace(/[^0-9a-fA-F]/g, "").substring(0, 6).toUpperCase();
    }

    if (input.length < 6) {
        cb(new Error("Please provide at least 6 hexadecimal digits."));
    } else {
        if (db) {
            lookup(input, cb);
        } else {
            fs.readFile(dbPath, function (err, data) {
                if (err) return cb(err);
                try {
                    db = JSON.parse(data);
                } catch (err) {
                    return cb(err);
                }
                lookup(input, cb);
            });
        }
    }
}

oui.update = function (cb) {
    var interval;

    if (isCLI) {
        process.stdout.write("Fetching " + source + " ...\n");
        interval = spin();
    }

    require("got")(source, function (err, body) {
        if (isCLI) {
            if (err) return process.stdout.write(err);
            if (interval) clearInterval(interval);
            spin.clear();
        }
        if (err) return cb(err);
        parse(body.split("\n"), function (result) {
            fs.writeFile(dbPath, JSON.stringify(result, null, 4), function () {
                if (cb) cb();
            });
        });
    });
};

function lookup(input, cb) {
    if (typeof db[input] !== "undefined")  {
        cb(null, db[input]);
    } else {
        cb(new Error("Prefix '" + input + "' not found in database."));
    }
}

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
            if (err) {
                process.stdout.write(err + "\n");
            } else {
                process.stdout.write("Database updated successfully!\n");
            }
            process.exit(err ? 1 : 0);
        });
    } else if (!arg) {
        fs.readFile(path.join(__dirname + "/package.json"), function (err, data) {
            var pkg = JSON.parse(data);
            process.stdout.write([
                pkg.name + "@" + pkg.version + " - " + pkg.homepage,
                "",
                "Usage: ",
                "  oui MAC                 Look up an MAC-address or OUI prefix.",
                "  oui --update            Update the database.\n"
            ].join("\n"));
            process.exit(1);
        });
    } else {
        oui(arg, function (err, result) {
            if (err) {
                process.stdout.write(err.message + "\n");
                process.exit(1);
            } else {
                process.stdout.write(result + "\n");
                process.exit(0);
            }
        });
    }
}

exports = module.exports = oui;
