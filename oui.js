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
    var result;
    try {
        result = oui(arg);
    } catch (err) {
        process.stdout.write(err.message + "\n");
        process.exit(1);
    }

    if (result) {
        process.stdout.write(result + "\n");
    } else {
        process.stdout.write(arg + " not found in database\n");
    }
    process.exit(0);
}
