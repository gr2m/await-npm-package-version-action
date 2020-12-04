# await-npm-package-version-action

> GitHub Action to wait for an npm package version to become available

[![Build Status](https://github.com/gr2m/await-npm-package-version-action/workflows/Test/badge.svg)](https://github.com/gr2m/await-npm-package-version-action/actions)

When a new version is published to the npm registry using `npm publish`, it may not be immediately accessible in the npm registry. When installing the latest version of the same package right after the publish, it's likely that the previously published version will be returned. This action helps to halt the current workflow until the new version is accessible on https://registry.npmjs.org/.

## Usage

Notify users only when a release was published. The [repository dispatch event type](https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-a-repository-dispatch-event) is set to `[current repositories full name] release` (e.g. `gr2m/release-notifire action`)

```yml
name: Release Notification
on:
  release:
    types:
      - published

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses gr2m/await-npm-package-version-action@v1
      - with:
          package: example
          version: ${{ github.event.release.tag_name }} # v1.2.3 is automatically parsed as "1.2.3"
          timeout: 300 # time in seconds, defaults to 5 minutes
      # it is now save to assume that `npm install example@latest` will return the new version
```

## How it works

The action continuously sends a request to `https://registry.npmjs.org/[package]` and checks if the JSON response's `versions` object has a key for the configured version.

If the looked for version is not available after 300 seconds (configurable with `timeout`), the action ends with an error.

## License

[ISC](LICENSE)
