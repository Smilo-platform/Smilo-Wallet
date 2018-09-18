# Build the webplugin
npm run build-webplugin

# Create the dev/prod output folder
mkdir -p ./webplugin-builds/$2

# Remove previous files
rm -rf ./webplugin-builds/$2/Smilo-Wallet-Extension-$1

# Create safari extension wallet directory 
mkdir ./webplugin-builds/$2/Smilo-Wallet-Extension-$1

# Copy all build files
cp -R ./www ./webplugin-builds/$2/Smilo-Wallet-Extension-$1

# Copy all assets
cp -R ./src/assets ./webplugin-builds/$2/Smilo-Wallet-Extension-$1

# Copy the icon
cp ./src/webplugin/icon.png ./webplugin-builds/$2/Smilo-Wallet-Extension-$1

# Create popup directory
mkdir ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/popup

# Copy all popup files
cp ./webplugin-build-files/popup.css ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/popup
cp ./webplugin-build-files/popup.js ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/popup
cp ./webplugin-build-files/popup.js.map ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/popup
cp ./src/webplugin/popup.html ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/popup

if [ $1 != "Safari.safariextension" ]
then
    # Copy the manifest file
    node ./scripts/webplugin-build-manifest-file.js $1 $2
    # Generate the sha256 hash for the inline scripts
    npm run webplugin-generate-sha256-hash $1 $2
fi

if  [ $1 = "Edge" ]
then
    mkdir -p ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/lib

    # Copy all Edge specific files
    cp -R ./webplugin-build-files/edge/backgroundScriptsAPIBridge.js ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/lib
    cp -R ./webplugin-build-files/edge/contentScriptsAPIBridge.js ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/lib
fi

if [ $1 = "Safari.safariextension" ]
then
    # Copy all Safari specific files
    cp ./webplugin-build-files/safari/global.html ./webplugin-builds/$2/Smilo-Wallet-Extension-$1
    cp ./webplugin-build-files/safari/Info.plist ./webplugin-builds/$2/Smilo-Wallet-Extension-$1
fi

if [ $2 = "dev" ]
then
    sed -i '' '2s/.*/let baseUrl = \"http:\/\/localhost:8090\"; /' ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/popup/popup.js
else 
    sed -i '' '2s/.*/let baseUrl = \"https:\/\/prototype-api.smilo.network\"; /' ./webplugin-builds/$2/Smilo-Wallet-Extension-$1/popup/popup.js
fi