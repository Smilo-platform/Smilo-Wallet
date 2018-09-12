# Build the webplugin
npm run build-webplugin safari

# Create the dev output folder
mkdir -p ./webplugin-builds/dev

# Remove previous files
rm -rf ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension

# Create Safari extension wallet directory 
mkdir ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension

# Copy all build files
cp -R ./www ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension

# Copy all assets
cp -R ./src/assets ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension

# Create popup directory
mkdir ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension/popup

# Copy all popup files
cp ./webplugin-build-files/popup.css ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension/popup
cp ./webplugin-build-files/popup.js ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension/popup
cp ./webplugin-build-files/popup.js.map ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension/popup
cp ./src/webplugin/popup.html ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension/popup

# Copy the icon
cp ./src/webplugin/icon.png ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension

# Copy all Safari specific files
cp ./src/webplugin/safari/global.html ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension
cp ./src/webplugin/safari/Info.plist ./webplugin-builds/dev/Smilo-Wallet-Safari.safariextension

sed -i '' '2s/.*/let baseUrl = "http:\/\/localhost:8090"; /' ./webplugin-build-files/popup.js