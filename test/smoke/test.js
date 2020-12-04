const tap = require("tap");
const nock = require("nock");

nock.disableNetConnect();

// SETUP
process.env.GITHUB_ACTION = "release-notification";
process.env.GITHUB_REPOSITORY = "gr2m/await-npm-package-version-action";

process.env.INPUT_PACKAGE = "@octokit/openapi";
process.env.INPUT_VERSION = "v1.0.1";

// set other env variables so action-toolkit is happy
process.env.GITHUB_EVENT_PATH = "";
process.env.GITHUB_REF = "";
process.env.GITHUB_WORKSPACE = "";
process.env.GITHUB_WORKFLOW = "";
process.env.GITHUB_ACTOR = "";
process.env.GITHUB_SHA = "";

nock("https://registry.npmjs.org:443")
  .get("/@octokit%2fopenapi")
  .reply(200, {
    versions: {
      "1.0.0": {},
    },
  })
  .get("/@octokit%2fopenapi")
  .reply(200, {
    versions: {
      "1.0.0": {},
      "1.0.1": {},
    },
  });

require("../../");

process.on("exit", (code) => {
  tap.equal(code, 0);
  tap.deepEqual(nock.pendingMocks(), []);

  process.exit(0);
});
