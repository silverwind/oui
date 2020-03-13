"use strict";

const oui = require(".");
const nock = require("nock");
const {join} = require("path");
const {test, expect, beforeAll, afterAll} = global;

beforeAll(() => {
  nock("https://linuxnet.ca").persist().get("/ieee/oui.txt").replyWithFile(200, join(__dirname, "fixtures/sanitized.txt"));
  nock("http://standards.ieee.org").persist().get("/develop/regauth/oui/oui.txt").replyWithFile(200, join(__dirname, "fixtures/sanitized.txt"));
});

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

test("oui.update", async () => {
  expect(await Promise.all([
    oui.update(),
    oui.update({url: "https://linuxnet.ca/ieee/oui.txt"}),
    oui.update({url: "http://standards.ieee.org/develop/regauth/oui/oui.txt"}),
  ])).toEqual([undefined, undefined, undefined]);
});

afterAll(() => {
  nock.cleanAll();
});
