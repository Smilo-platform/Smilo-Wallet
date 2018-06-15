# Build the project
ionic cordova build android --prod --release

# Create the release directory if it does not exists
mkdir -p ./release

# Move the APK to the release folder
mv ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./release/android-unsigned.apk

# Remove any previous builds
[ -e ./release/android.apk ] && rm ./release/android.apk

# Sign the application
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $SMILO_WALLET_KEYSTORE_LOCATION ./release/android-unsigned.apk smilo-wallet

# Zipalign
zipalign -v 4 ./release/android-unsigned.apk ./release/android.apk

# Ensure the signing went ok
apksigner verify ./release/android.apk

# Clean up
rm ./release/android-unsigned.apk
