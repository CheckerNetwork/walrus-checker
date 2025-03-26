#!/usr/bin/env bash
set -e

git diff --quiet HEAD || (echo "please revert the uncommited changes"; exit 1)

VERSION="${1?Missing required argument: semver}"

(echo "$VERSION" | grep -Eq  '^\d+\.\d+\.\d+$') || {
  echo Invalid version string \'"$VERSION"\'. Must be MAJOR.MINOR.PATCH
  exit 1
}

git commit -m v"$VERSION" --allow-empty
git tag -s v"$VERSION" -m v"$VERSION"
git push
git push origin v"$VERSION"
open https://github.com/checkernetwork/walrus-checker/releases/new?tag=v"$VERSION"
