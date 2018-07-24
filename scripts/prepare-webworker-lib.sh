# Because we are lazy and do not want to use Webpack we instead use this script.
# This script will strip certain lines from the compiled Javascript files which
# would otherwise cause a runtime error.

for file in src/assets/scripts/webworker/***/*
do
    if [ $(uname -s) = "Darwin" ]
    then
        sed -i '' '/export/d' $file
        sed -i '' '/import/d' $file
        sed -i '' '/var SHA1PRNG = prng.SHA1PRNG;/d' $file
    else
        sed -i '/export/d' $file
        sed -i '/import/d' $file
        sed -i '/var SHA1PRNG = prng.SHA1PRNG;/d' $file
    fi
done

# Copy files two folders higher because Android
mv ./src/assets/scripts/webworker/merkle/LamportGenerator.js ./src/assets/scripts/LamportGenerator.js
mv ./src/assets/scripts/webworker/random/SHA1PRNG.js ./src/assets/scripts/SHA1PRNG.js

# Clean up
rm -rf ./src/assets/scripts/webworker