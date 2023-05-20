"use strict";

const oui = require(".");
const nock = require("nock");
const {join} = require("node:path");
const {test, expect, beforeAll, afterAll} = global;

beforeAll(() => {
  nock("https://linuxnet.ca").persist().get("/ieee/oui.txt").replyWithFile(200, join(__dirname, "fixtures/sanitized.txt"));
  nock("https://standards-oui.ieee.org").persist().get("/oui/oui.txt").replyWithFile(200, join(__dirname, "fixtures/ieee.txt"));
});

test("oui", () => {
  expect(oui("203706")).toMatch(/cisco/i);
  expect(oui("20:37:06")).toMatch(/cisco/i);
  expect(oui("20:37:6")).toMatch(/cisco/i);
  expect(oui("20:37:06:11:22:33")).toMatch(/cisco/i);
  expect(oui("20:37:6:11:22:33")).toMatch(/cisco/i);
  expect(oui("20370")).toEqual(null);

  expect(() => {oui(null);}).toThrow();
  expect(() => {oui(undefined);}).toThrow();
  expect(() => {oui([]);}).toThrow();
  expect(() => {oui("20370", {strict: true});}).toThrow();
  expect(() => {oui("abcd", {strict: true});}).toThrow();
  expect(() => {oui(null, {strict: true});}).toThrow();
  expect(() => {oui(undefined, {strict: true});}).toThrow();
});

test("oui.search", () => {
  expect(oui.search("*Juniper Systems*").length >= 1).toBeTruthy();
  expect(oui.search(["*Juniper Systems*"]).length >= 1).toBeTruthy();
  expect(oui.search(["*Juniper*", "*Systems*"]).length >= 1).toBeTruthy();
});

test("oui.update", async () => {
  expect(await Promise.all([
    oui.update({test: true}),
    oui.update({test: true, url: "https://linuxnet.ca/ieee/oui.txt"}),
    oui.update({test: true, url: "https://standards-oui.ieee.org/oui/oui.txt"}),
  ])).toEqual([undefined, undefined, undefined]);
});

afterAll(() => {
  nock.cleanAll();
});
