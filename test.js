"use strict";

const assert = require("assert");
const oui = require(".");

function exit(err) {
  if (err) console.info(err);
  process.exit(err ? 1 : 0);
}

async function main() {
  assert.ok(/cisco/i.test(oui("203706")));
  assert.ok(/cisco/i.test(oui("20:37:06")));
  assert.ok(/cisco/i.test(oui("20:37:6")));
  assert.ok(/cisco/i.test(oui("20:37:06:11:22:33")));
  assert.ok(/cisco/i.test(oui("20:37:6:11:22:33")));

  assert.ok(oui.search("*Juniper Systems*").length >= 1);
  assert.ok(oui.search(["*Juniper Systems*"]).length >= 1);
  assert.ok(oui.search(["*Juniper*", "*Systems*"]).length >= 1);

  assert.equal(oui("20370"), null);

  assert.throws(() => { oui(null); }, Error);
  assert.throws(() => { oui(undefined); }, Error);
  assert.throws(() => { oui([]); }, Error);
  assert.throws(() => { oui("20370", {strict: true}); }, Error);
  assert.throws(() => { oui("abcd", {strict: true}); }, Error);
  assert.throws(() => { oui(null, {strict: true}); }, Error);
  assert.throws(() => { oui(undefined, {strict: true}); }, Error);

  try {
    await oui.update({url: "abc"});
  } catch (err) {
    assert(err instanceof Error);
  }

  try {
    await oui.update({test:true});
  } catch (err) {
    assert(!(err instanceof Error));
  }
}

main().then(exit).catch(exit);
