# Build the webplugin
npm run build-webplugin edge

# Create the dev output folder
mkdir -p ./webplugin-builds/dev

# Remove previous files
rm -rf ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension

# Create safari extension wallet directory 
mkdir ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension

# Copy all build files
cp -R ./www ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension

# Copy all assets
cp -R ./src/assets ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension

# Copy the icon
cp ./src/webplugin/icon.png ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension

# Create popup directory
mkdir ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/popup

# Copy all popup files
cp ./webplugin-build-files/popup.css ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/popup
cp ./webplugin-build-files/popup.js ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/popup
cp ./webplugin-build-files/popup.js.map ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/popup
cp ./src/webplugin/popup.html ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/popup

# Copy the manifest file
cp ./src/webplugin/edge/manifest.json ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension

# Create lib directory
mkdir ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/lib

# Copy all Edge specific files
cp -R ./src/webplugin/edge/backgroundScriptsAPIBridge.js ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/lib
cp -R ./src/webplugin/edge/contentScriptsAPIBridge.js ./webplugin-builds/dev/Smilo-Wallet-Edge-Extension/lib

sed -i '' '2s/.*/let baseUrl = "http:\/\/localhost:8090"; /' ./webplugin-build-files/popup.js