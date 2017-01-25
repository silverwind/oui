#!/usr/bin/env node
"use strict";

process.title = "oui";

// node 0.10 compat
this.Promise = require("pinkie-promise");

require("get-stdin")().then(function(str) {
  str = str.trim();
  if (str)
    lookup(str);
  else
    parseArgs(process.argv[2]);
});

function parseArgs(arg) {
  if (arg === "--update") {
    var interval = require("char-spinner")();

    require("./update.js")({
      cli: true,
      url: process.argv[3],
    }, function(err) {
      clearInterval(interval);
      if (err) process.stdout.write(err + "\n");
      process.exit(err ? 1 : 0);
    });
  } else if (!arg || arg === "--help") {
    process.stdout.write([
      "",
      "  Usage: oui [mac]|[options]",
      "",
      "  Options:",
      "",
      "    --help           display this help text",
      "    --update [url]   update the database with optional source URL",
      "    --version        print the version",
      "",
      "  Examples:",
      "    oui 20:37:06:12:34:56",
      "    oui 203706",
      "    echo 20:37:06:12:34:56 | oui",
      "    oui --update",
    ].join("\n"));
    process.exit(0);
  } else if (arg === "-v" || arg === "-V" || arg === "--version") {
    process.stdout.write(require("./package.json").version + "\n");
  } else {
    lookup(arg);
  }
}

function lookup(str) {
  var oui = require("./");
  var result;

  try {
    result = oui(str);
  } catch (err) {
    process.stdout.write(err.message + "\n");
    process.exit(1);
  }

  if (result)
    process.stdout.write(result + "\n");
  else
    process.stdout.write(str + " not found in database\n");

  process.exit(0);
}
