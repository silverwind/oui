#!/usr/bin/env node
"use strict";

process.title = "oui";
parseArgs();

function parseArgs() {
  const args = require("minimist")(process.argv.slice(2), {
    boolean: true,
    string: ["_"],
  });

  if (args._[0] === "update" || args.update) {
    const interval = require("char-spinner")();
    const opts = {};
    if (args._[1]) opts.url = args._[1];
    if (args.w) opts.web = true;

    require("./update.js")(opts).then(() => {
      clearInterval(interval);
      process.exit(0);
    }).catch(err => {
      clearInterval(interval);
      process.stdout.write(`${err}\n`);
      process.exit(1);
    });
  } else if (args._[0] === "search" || args.search) {
    const params = args.search ? args._ : args._.slice(1);
    search(params.map(pattern => {
      return `*${pattern}*`;
    }));
  } else if (!args._.length || args._[0] === "help" || args.help) {
    process.stdout.write(`${[
      "",
      "  Usage: oui [mac]|[command] [options]",
      "",
      "  Commands:",
      "    [mac]                look up a MAC address in the database",
      "    search [patterns]    search vendors using one or more search patterns",
      "    version              print the version",
      "    update [url] [-w]    update the database with optional source URL. If -w",
      "                         is given, oui.web.js will also be updated.",
      "",
      "  Examples:",
      "    oui 20:37:06:12:34:56",
      "    oui 203706",
      "    oui update",
      "    oui search cisco theory",
      "    echo 20:37:06:12:34:56 | oui",
      "    echo 203706 | oui",
    ].join("\n")}\n\n`);
    process.exit(0);
  } else if (args._[0] === "version" || args.v || args.V || args.version) {
    const pkg = require("path").join(__dirname, "package.json");
    process.stdout.write(`${require(pkg).version}\n`);
  } else {
    lookup(args._[0]);
  }
}

function lookup(str) {
  let result;
  try {
    result = require(".")(str);
  } catch (err) {
    process.stdout.write(`${err.message}\n`);
    process.exit(1);
  }

  if (result) {
    process.stdout.write(`${result}\n`);
  } else {
    process.stdout.write(`${str} not found in database\n`);
  }

  process.exit(0);
}

function search(patterns) {
  const results = require(".").search(patterns, {nocase: true});

  if (!results.length) {
    return process.exit(1);
  }

  const structured = [];
  results.forEach(result => {
    const oui = result.oui;
    const [organzation, address, country] = result.organization.split("\n");
    structured.push({oui, organzation, address, country});
  });

  const arr = [Object.keys(structured[0]).map(name => name.toUpperCase())];
  for (const entry of structured) arr.push(Object.values(entry).map(v => v || ""));
  process.stdout.write(`${require("text-table")(arr, {hsep: "    "})}\n`);
  process.exit(0);
}
