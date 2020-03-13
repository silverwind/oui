"use strict";

const oui = require(".");
const {test, expect} = global;

test("oui", () => {
  expect(oui("203706")).toMatch(/cisco/i);
  expect(oui("20:37:06")).toMatch(/cisco/i);
  expect(oui("20:37:6")).toMatch(/cisco/i);
  expect(oui("20:37:06:11:22:33")).toMatch(/cisco/i);
  expect(oui("20:37:6:11:22:33")).toMatch(/cisco/i);
  expect(oui("20370")).toEqual(null);

  expect(() => {oui(null)}).toThrow();
  expect(() => {oui(undefined)}).toThrow();
  expect(() => {oui([])}).toThrow();
  expect(() => {oui("20370", {strict: true})}).toThrow();
  expect(() => {oui("abcd", {strict: true})}).toThrow();
  expect(() => {oui(null, {strict: true})}).toThrow();
  expect(() => {oui(undefined, {strict: true})}).toThrow();
});

test("oui.search", () => {
  expect(oui.search("*Juniper Systems*").length >= 1).toBeTruthy();
  expect(oui.search(["*Juniper Systems*"]).length >= 1).toBeTruthy();
  expect(oui.search(["*Juniper*", "*Systems*"]).length >= 1).toBeTruthy();
});

// test("oui.update", async () => {
//   expect(await oui.update({test: true})).toBeTruthy();
// });
