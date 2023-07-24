# exit automatically if any command returns a non-zero exit code
set -e

vitest --run

export BUILD_MODE=lib

# first build to pass errors...
yarn build

# then upgrade version
npm version patch --no-git-tag-version

# build again, with version update
yarn build

npm publish

export BUILD_MODE=default