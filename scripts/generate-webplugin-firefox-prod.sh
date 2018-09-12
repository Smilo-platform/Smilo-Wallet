# Build the webplugin
npm run build-webplugin firefox

# Create the prod output folder
mkdir -p ./webplugin-builds/prod

# Remove previous files
rm -rf ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension

# Create safari extension wallet directory 
mkdir ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension

# Copy all build files
cp -R ./www ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension

# Copy all assets
cp -R ./src/assets ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension

# Copy the icon
cp ./src/webplugin/icon.png ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension

# Create popup directory
mkdir ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension/popup

# Copy all popup files
cp ./webplugin-build-files/popup.css ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension/popup
cp ./webplugin-build-files/popup.js ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension/popup
cp ./webplugin-build-files/popup.js.map ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension/popup
cp ./src/webplugin/popup.html ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension/popup

# Copy the manifest file
cp ./src/webplugin/firefox/manifest.json ./webplugin-builds/prod/Smilo-Wallet-Firefox-Extension