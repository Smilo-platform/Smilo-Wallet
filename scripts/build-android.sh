# Build the project
ionic cordova build android

# Create the release directory if it does not exists
mkdir -p ./release

# Move the APK to the release folder
mv ./platforms/android/app/build/outputs/apk/debug/app-debug.apk ./release/android-unsigned.apk
