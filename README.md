# walrus-checker
Walrus Checker Module

## Development

Install [Zinnia CLI](https://github.com/filecoin-station/zinnia).

```bash
$ # Lint
$ npx lint
$ # Run module
$ zinnia run main.js
$ # Test module
$ zinnia run test.js
```

## Release

On a clean working tree, run the following command:

```bash
$ ./release.sh <semver>
$ # Example
$ ./release.sh 1.0.0
```

Use GitHub's changelog feature to fill out the release notes.

Publish the new release and let the CI/CD workflow upload the sources
to IPFS & IPNS.
