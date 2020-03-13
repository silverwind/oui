"use strict";

const minimatch = require("minimatch");

const dbs = {};
const strictFormats = [
  /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i,
  /^([0-9A-F]{2}[:-]){2}([0-9A-F]{2})$/i,
  /^([0-9A-F]{4}[.]){2}([0-9A-F]{4})$/i,
  /^[0-9A-F]{6}$/i,
  /^[0-9A-F]{12}$/i
];

module.exports = (input, opts = {}) => {
  if (typeof input !== "string") throw new Error("Input not a string");

  const file = opts.file || "./oui.json";
  if (!dbs[file]) dbs[file] = require(file);
  const db = dbs[file];
  input = input.toUpperCase();

  if (opts.strict) {
    const isStrict = strictFormats.some(regex => regex.test(input));
    if (!isStrict) throw new Error("Input not in strict format");
    input = input.replace(/[.:-]/g, "").substring(0, 6);
  } else {
    input = zeroPad(input).replace(/[^0-9a-fA-F]/g, "").substring(0, 6);
  }

  if (input.length < 6) return null;
  return db[input] || null;
};

module.exports.search = (inputs, opts = {}) => {
  if (typeof inputs !== "string" && !Array.isArray(inputs)) throw new Error("Input not a string or Array");
  inputs = Array.isArray(inputs) ? inputs : [inputs];
  const file = opts.file || "./oui.json";
  if (!dbs[file]) dbs[file] = require(file);
  const db = dbs[file];

  const results = [];
  for (const oui of Object.keys(db)) {
    const organization = db[oui];
    if (inputs.every(pattern => minimatch(organization, pattern, opts))) {
      results.push({oui, organization});
    }
  }
  return results;
};

module.exports.update = (opts) => {
  return new Promise((resolve, reject) => {
    opts = Object.assign({cli: false}, opts);
    require("./update.js")(opts).then(newdb => {
      dbs["./oui.json"] = newdb;
      resolve();
    }).catch(reject);
  });
};

// Zero-pad colon notation as seen in BSD `arp`. eg. 1:2:3 should become 01:02:03
function zeroPad(str) {
  if (!/^[0-9A-F:]+$/.test(str)) return str;
  return str.split(":").map(part => part.length === 1 ? `0${part}` : part).join(":");
}
