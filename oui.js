#!/usr/bin/env node
import minimist from "minimist";
import process from "node:process";

function exit(err) {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
}

async function main() {
  process.title = "oui";
  const args = minimist(process.argv.slice(2), {boolean: true, string: ["_"]});

  if (!args._.length || args._[0] === "help" || args.help) {
    process.stdout.write(`${[
      "",
      "  Usage: oui [mac]|[command] [options]",
      "",
      "  Commands:",
      "    [mac]                look up a MAC address in the database",
      "    version              print the version",
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
    process.stdout.write(`${import.meta.VERSION || "0.0.0"}\n`);
  } else {
    const {default: ouiData} = await import("oui-data", {assert: {type: "json"}});
    const result = ouiData[args._[0].replace(/:/g, "").toUpperCase().substring(0, 6)];
    if (result) {
      process.stdout.write(`${result}\n`);
    } else {
      process.stdout.write(`${args._[0]} not found in database\n`);
    }
  }
}

main().then(exit).catch(exit);
