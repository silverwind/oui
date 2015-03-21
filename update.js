#!/usr/bin/env node
"use strict";

var fs     = require("fs"),
    got    = require("got"),
    dbPath = require("path").join(__dirname + "/db.json");

var SOURCE = "http://standards.ieee.org/develop/regauth/oui/oui.txt";

module.exports = function update(isCLI, cb) {
    got(SOURCE, function (err, body) {
        if (err) return cb(err);
        parse(body.split("\n"), function (result) {
            if (!isCLI) {
                cb(null, result);
                fs.writeFile(dbPath, JSON.stringify(result, null, 1));
            } else {
                fs.writeFile(dbPath, JSON.stringify(result, null, 1), cb);
            }
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
