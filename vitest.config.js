module.exports = {
  test: {
    environment: "node",
    testTimeout: 20000,
    open: false,
    allowOnly: true,
    passWithNoTests: true,
    globals: true,
    watch: false,
    outputDiffLines: Infinity,
  },
};
