import {execa} from "execa";

test("cli", async () => {
  const {stdout, exitCode} = await execa("node", ["--no-warnings", "./bin/oui.js", "20:37:06:12:34:56"]);
  expect(stdout).toMatchSnapshot();
  expect(exitCode).toEqual(0);
});
