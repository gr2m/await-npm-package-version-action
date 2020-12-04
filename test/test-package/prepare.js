const { writeFileSync } = require("fs");
const core = require("@actions/core");

if (!process.env.NPM_TOKEN) {
  throw new Error("NPM_TOKEN is not set");
}

const pkg = require("./package.json");
pkg.version = "1.0.0-test-" + Date.now();

writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
writeFileSync(
  ".npmrc",
  `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`
);
core.setOutput("version", pkg.version);
