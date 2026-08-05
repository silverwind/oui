import spawn from "nano-spawn";

const macs = ["20:37:06:12:34:56", "20_37_06", "203706", "c85ce27", "8C:1F:64:AF:A1:23", "FF:FF:FF:FF:FF:FF"];

test("cli", async () => {
  const results = await Promise.all(macs.map(mac => spawn("node", ["./dist/index.js", mac])));
  for (const {stdout} of results) expect(stdout).toMatchSnapshot();
});
