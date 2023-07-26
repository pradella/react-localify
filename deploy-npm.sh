# exit automatically if any command returns a non-zero exit code
set -e

TAG="$1"  # Assign the first command-line argument to the variable TAG

vitest --run

# set library mode
export BUILD_MODE=lib

# first build to pass errors...
yarn build

# then upgrade version
if [ -n "$TAG" ]; then
    npm version prerelease --preid="$TAG" --no-git-tag-version
else
    npm version patch --no-git-tag-version
fi


# build again, with version update
yarn build

# publish
if [ -n "$TAG" ]; then
    npm publish --tag "$TAG"
else
    npm publish
fi

# go back default mode
export BUILD_MODE=default