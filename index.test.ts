import spawn from "nano-spawn";

test("cli", async () => {
  let stdout, exitCode;

  ({stdout} = await spawn("node", ["./dist/index.js", "20:37:06:12:34:56"]));
  expect(stdout).toMatchSnapshot();
  ({stdout} = await spawn("node", ["./dist/index.js", "20_37_06"]));
  expect(stdout).toMatchSnapshot();
  ({stdout} = await spawn("node", ["./dist/index.js", "203706"]));
  expect(stdout).toMatchSnapshot();
});
