const { inspect } = require("util");

const core = require("@actions/core");
const got = require("got");

const TIMEOUT_DEFAULT = 300;

main();

function getRegistryURL(registry, package) {
  const sanitizedPackageName = package.replace(/\//, "%2f");
  const registryURL = new URL(sanitizedPackageName, registry);

  return registryURL.toString();
}

async function main() {
  try {
    const package = core.getInput("package");
    const version = core.getInput("version").replace(/^v/, "");
    const timeout = core.getInput("timeout") || TIMEOUT_DEFAULT;
    const registry = core.getInput("registry") || "https://registry.npmjs.org";
    const endtime = Date.now() + timeout * 1000;

    core.info(`waiting for ${version} of ${package} `);

    let hasVersion;
    let etag;
    do {
      const { body, headers } = await got(getRegistryURL(registry, package), {
        headers: {
          "if-none-match": `"${etag}"`,
        },
        responseType: "json",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Date.now() > endtime) {
        core.error(`Timeout (${timeout}s)`);
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
