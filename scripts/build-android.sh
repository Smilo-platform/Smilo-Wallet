# Build the project
ionic cordova build android --prod --release

# Create the release directory if it does not exists
mkdir -p ./release

# Move the APK to the release folder
mv ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./release/android.apk
