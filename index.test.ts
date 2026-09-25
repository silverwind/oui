import spawn from "nano-spawn";

const cisco = "Cisco Systems, Inc\n80 West Tasman Drive\nSan Jose CA 94568\nUnited States";
const expected = new Map([
  ["20:37:06:12:34:56", cisco],
  ["20_37_06", cisco],
  ["203706", cisco],
  ["c85ce27", "SYNERGY SYSTEMS AND SOLUTIONS\nA1526, GREEN FIELDS COLONY\nFaridabad HARYANA 121001\nIndia"],
  ["8C:1F:64:AF:A1:23", "DATA ELECTRONIC DEVICES, INC\n32 NORTHWESTERN DR\nSALEM NH 03079\nUnited States"],
  ["FF:FF:FF:FF:FF:FF", "FF:FF:FF:FF:FF:FF not found in database"],
]);

test("cli", async () => {
  const results = await Promise.all(Array.from(expected.keys(), mac => spawn("node", ["./dist/index.js", mac])));
  expect(results.map(({stdout}) => stdout)).toEqual(Array.from(expected.values()));
});
