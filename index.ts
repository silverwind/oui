#!/usr/bin/env node
import {exit, argv, stdout} from "node:process";
import pkg from "./package.json" with {type: "json"};

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
    "  oui 8C1F64AFA",
    "  oui 20_37_06",
    "  oui c85ce27",
    "  oui 203706",
  ].join("\n")}\n`);
} else if (["version", "--version", "-v", "-V"].includes(args[0])) {
  stdout.write(`${pkg.version || "0.0.0"}\n`);
} else {
  const ouiData: Record<string, string> = (await import("oui-data", {with: {type: "json"}})).default;
  const mac = args[0].replace(/[^0-9a-f]/gi, "").toUpperCase();
  const result = ouiData[mac.substring(0, 9)] ?? ouiData[mac.substring(0, 7)] ?? ouiData[mac.substring(0, 6)];
  if (result) {
    stdout.write(`${result}\n`);
  } else {
    stdout.write(`${args[0]} not found in database\n`);
  }
}

exit(0);
