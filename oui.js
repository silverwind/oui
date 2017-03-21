#!/usr/bin/env node
"use strict";

process.title = "oui";

require("get-stdin")().then(function(str) {
  str = str.trim();
  if (str)
    lookup(str);
  else
    parseArgs(process.argv[2]);
});

function parseArgs(arg) {
  if (arg === "--update") {
    const interval = require("char-spinner")();
    const opts = {cli: true};
    if (process.argv[3]) opts.url = process.argv[3];

    require("./update.js")(opts).then(function() {
      clearInterval(interval);
      process.exit(0);
    }).catch(function(err) {
      clearInterval(interval);
      process.stdout.write(err + "\n");
      process.exit(1);
    });
  } else if (arg === "--search") {
    search(process.argv.slice(3));
  } else if (!arg || arg === "--help") {
    process.stdout.write([
      "",
      "  Usage: oui [mac]|[options]",
      "",
      "  Options:",
      "",
      "    --help              display this help text",
      "    --update [url]      update the database with optional source URL",
      "    --search [pattern]  search vendors using one or more '*search*' patterns",
      "    --version           print the version",
      "",
      "  Examples:",
      "    oui 20:37:06:12:34:56",
      "    oui 203706",
      "    echo 20:37:06:12:34:56 | oui",
      "    echo 203706 | oui",
      "    oui --search '*Cisco*Theory*'",
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
  var result;
  try {
    result = require(".")(str);
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

function search(patterns) {
  const results = require(".").search(patterns);
  const keys = Object.keys(results);
  let structured = [];

  if (!keys.length) {
    return process.exit(1);
  }

  keys.forEach(function(oui) {
    const [organzation, address, country] = results[oui].split("\n");
    structured.push({oui, organzation, address, country});
  });

  process.stdout.write(require("columnify")(structured, {columnSplitter: "    "}) + "\n");
  process.exit(0);
}
