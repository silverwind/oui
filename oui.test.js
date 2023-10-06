import {execa} from "execa";

test("cli", async () => {
  let stdout, exitCode;

  ({stdout, exitCode} = await execa("node", ["./bin/oui.js", "20:37:06:12:34:56"]));
  expect(stdout).toMatchSnapshot();
  expect(exitCode).toEqual(0);

  ({stdout, exitCode} = await execa("node", ["./bin/oui.js", "20_37_06"]));
  expect(stdout).toMatchSnapshot();
  expect(exitCode).toEqual(0);

  ({stdout, exitCode} = await execa("node", ["./bin/oui.js", "203706"]));
  expect(stdout).toMatchSnapshot();
  expect(exitCode).toEqual(0);
});
