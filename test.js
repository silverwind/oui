"use strict";

const assert = require("assert");
const oui = require(".");

assert.ok(/cisco/i.test(oui("203706")));
assert.ok(/cisco/i.test(oui("20:37:06")));
assert.ok(/cisco/i.test(oui("20:37:06:11:22:33")));

assert.equal(oui("20370"), null);

assert.throws(() => { oui(null); }, Error);
assert.throws(() => { oui(undefined); }, Error);
assert.throws(() => { oui([]); }, Error);
assert.throws(() => { oui("20370", {strict: true}); }, Error);
assert.throws(() => { oui("abcd", {strict: true}); }, Error);
assert.throws(() => { oui(null, {strict: true}); }, Error);
assert.throws(() => { oui(undefined, {strict: true}); }, Error);

oui.update({url: "abc"}, function(err) {
  assert.ok(err);
  oui.update({test: true}, function(err) {
    assert.equal(err, null);
  });
});
