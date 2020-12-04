const { writeFileSync } = require("fs");
const core = require("@actions/core");

const pkg = require("./package.json");
pkg.version = "1.0.0-test-" + Date.now();

writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
core.setOutput("version", pkg.version);
