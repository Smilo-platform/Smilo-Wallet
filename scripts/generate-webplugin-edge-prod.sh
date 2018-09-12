# Build the webplugin
npm run build-webplugin edge

# Create the prod output folder
mkdir -p ./webplugin-builds/prod

# Remove previous files
rm -rf ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension

# Create safari extension wallet directory 
mkdir ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension

# Copy all build files
cp -R ./www ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension

# Copy all assets
cp -R ./src/assets ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension

# Copy the icon
cp ./src/webplugin/icon.png ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension

# Create popup directory
mkdir ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/popup

# Copy all popup files
cp ./webplugin-build-files/popup.css ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/popup
cp ./webplugin-build-files/popup.js ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/popup
cp ./webplugin-build-files/popup.js.map ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/popup
cp ./src/webplugin/popup.html ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/popup

# Copy the manifest file
cp ./src/webplugin/edge/manifest.json ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension

# Create lib directory
mkdir ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/lib

# Copy all Edge specific files
cp -R ./src/webplugin/edge/backgroundScriptsAPIBridge.js ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/lib
cp -R ./src/webplugin/edge/contentScriptsAPIBridge.js ./webplugin-builds/prod/Smilo-Wallet-Edge-Extension/lib