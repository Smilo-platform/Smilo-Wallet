# Build the webplugin
npm run build-webplugin firefox

# Create the dev output folder
mkdir -p ./webplugin-builds/dev

# Remove previous files
rm -rf ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension

# Create safari extension wallet directory 
mkdir ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension

# Copy all build files
cp -R ./www ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension

# Copy all assets
cp -R ./src/assets ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension

# Copy the icon
cp ./src/webplugin/icon.png ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension

# Create popup directory
mkdir ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension/popup

# Copy all popup files
cp ./webplugin-build-files/popup.css ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension/popup
cp ./webplugin-build-files/popup.js ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension/popup
cp ./webplugin-build-files/popup.js.map ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension/popup
cp ./src/webplugin/popup.html ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension/popup

# Copy the manifest file
cp ./src/webplugin/firefox/manifest.json ./webplugin-builds/dev/Smilo-Wallet-Firefox-Extension

sed -i '' '2s/.*/let baseUrl = "http:\/\/localhost:8090"; /' ./webplugin-build-files/popup.js