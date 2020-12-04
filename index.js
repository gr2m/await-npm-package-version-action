const { inspect } = require("util");

const core = require("@actions/core");
const got = require("got");

const TIMEOUT_DEFAULT = 300;

main();

async function main() {
  try {
    const package = core.getInput("package");
    const version = core.getInput("version").replace(/^v/, "");
    const timeout = core.getInput("timeout") | TIMEOUT_DEFAULT;
    const endtime = Date.now() + timeout * 1000;

    core.info(`waiting for ${version} of ${package} `);

    let hasVersion;
    let etag;
    do {
      const { body, headers } = await got(
        `https://registry.npmjs.org/${package.replace(/\//, "%2f")}`,
        {
          headers: {
            "if-none-match": `"${etag}"`,
          },
          responseType: "json",
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Date.now() > endtime) {
        core.setFailed(`Timeout (${timeout}s)`);
      }

      process.stdout.write(".");
      hasVersion = version in body.versions;
      etag = headers.etag;
    } while (!hasVersion);

    core.info(` ${version} found for ${package} in npm registry`);
  } catch (error) {
    core.debug(inspect(error, { depth: Infinity }));
    core.setFailed(error.message);
  }
}
