import {execa} from "execa";

test("cli", async () => {
  const {stdout, stderr, exitCode} = await execa("node", ["./bin/oui.js", "20:37:06:12:34:56"]);
  expect(stderr).toEqual("");
  expect(stdout).toMatchSnapshot();
  expect(exitCode).toEqual(0);
});
