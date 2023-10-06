#!/usr/bin/env node
import minimist from "minimist";
import {exit, argv, stdout} from "node:process";
import {createRequire} from "node:module";

function end(err) {
  if (err) console.error(err);
  exit(err ? 1 : 0);
}

async function main() {
  const args = minimist(argv.slice(2), {boolean: true, string: ["_"]});

  if (!args._.length || args._[0] === "help" || args.help) {
    stdout.write(`${[
      "Usage: oui [mac]",
      "",
      "Commands:",
      "  [mac]    look up a MAC address in the database",
      "  version  print the version",
      "",
      "Examples:",
      "  oui 20:37:06:12:34:56",
      "  oui 20_37_06",
      "  oui 203706",
    ].join("\n")}\n`);
    exit(0);
  } else if (args._[0] === "version" || args.v || args.V || args.version) {
    stdout.write(`${import.meta.VERSION || "0.0.0"}\n`);
  } else {
    const ouiData = createRequire(import.meta.url)("oui-data");
    const result = ouiData[args._[0].replace(/[^0-9a-f]/gi, "").toUpperCase().substring(0, 6)];
    if (result) {
      stdout.write(`${result}\n`);
    } else {
      stdout.write(`${args._[0]} not found in database\n`);
    }
  }
}

main().then(end).catch(end);
