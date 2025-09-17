#!/usr/bin/env node
import {exit, argv, stdout} from "node:process";
import {createRequire} from "node:module";
import pkg from "./package.json" with {type: "json"};

function end(err: Error | void) {
  if (err) console.error(err);
  exit(err ? 1 : 0);
}

async function main() { // eslint-disable-line @typescript-eslint/require-await
  const args = argv.slice(2);

  if (!args.length || ["help", "--help"].includes(args[0])) {
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
  } else if (["version", "--version", "-v", "-V"].includes(args[0])) {
    stdout.write(`${pkg.version || "0.0.0"}\n`);
  } else {
    const ouiData = createRequire(import.meta.url)("oui-data");
    const result = ouiData[args[0].replace(/[^0-9a-f]/gi, "").toUpperCase().substring(0, 6)];
    if (result) {
      stdout.write(`${result}\n`);
    } else {
      stdout.write(`${args[0]} not found in database\n`);
    }
  }
}

main().then(end).catch(end);
