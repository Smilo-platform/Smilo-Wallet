set -e

# Ensure translations are complete
npm run validate-translations:ci

# # Build the project
ionic cordova build ios --prod --release --aot

# # Create the release directory if it does not exists
mkdir -p ./release

cd ./platforms/ios

# Clean the xcode project
/usr/bin/xcodebuild clean \
    -project "Smilo Wallet.xcodeproj" \
    -configuration Release \
    -alltargets

# Build and archive using xcode
xcodebuild archive \
           -target "Smilo Wallet" \
           -scheme "Smilo Wallet" \
           -archivePath "./exported_archive" \
           -configuration archive

# Export it as .ipa
xcodebuild -exportArchive \
            -archivePath "./exported_archive.xcarchive" \
            -exportPath "../../release" \
            -exportOptionsPlist "./ExportOptions.plist"
