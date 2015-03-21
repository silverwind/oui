#!/usr/bin/env node
"use strict";

process.title = "oui";

var arg  = process.argv[2],
    oui  = require("./"),
    spin = require("char-spinner");

if (arg === "--update") {
    var interval = spin();
    oui.update(function (err) {
        clearInterval(interval);
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
        if (err) process.stdout.write(err.message + "\n");
        if (result) {
            process.stdout.write(result + "\n");
        } else {
            process.stdout.write(arg + " not found in database\n");
        }
        process.exit(err ? 1 : 0);
    });
}
