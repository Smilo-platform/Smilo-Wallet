# Smilo Wallet

## Project dependencies

This project relies on the following dependencies:
- NodeJS @ 8.11.2
- NPM @ 5.6.0
- Ionic @ 3.20.0
- Cordova @ 8.0.0
- Browserify @16.2.2

## Building and running the project

First make sure you have all Node modules installed by running the following command in the root of this project:

```
npm install
```

As part of the installation the bitcoinjs-lib will also be build. For more information see the chapter `Generating private and public keys`.

Next run the following command to run the project locally:

```
ionic serve
```

### Building and running on Android

First make sure you have the following dependencies installed:
- [Java SE 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- Gradle (for Mac use brew: `brew install gradle`)

Next build the project for Android using the following command:

```
ionic cordova build android
```

Or directly run the project using:

```
ionic cordova run android
```

#### Building a release version

Use the following command to build a release ready version for Android:

```
npm run release:android
```

The build APK can be found at `release/android.apk`.

This command will use the script found at `scripts/build-android.sh` to build a release ready APK.

For this command to work the environment variable `SMILO_WALLET_KEYSTORE_LOCATION` is expected to be defined.
This variable should point to the location where the keystore used to sign the app is located.

### Building and running on iOS

First make sure you have xCode installed.

Next build the project for iOS using the following command:

```
ionic cordova build ios
```

Or directly run the project using:

```
ionic cordova run ios
```

#### Building a release version

TODO

### Uploading a test version to Hockey App

We use [Hockey App](https://www.hockeyapp.net) for internal testing. To build a release version and upload to Hockey App use the following command:

```
npm run upload:hockey-app
```

For this to work the environment variable `HOCKEY_APP_TOKEN` is expected to be available.

## Testing the project

We use Jasmine and Karma to unit test this project. To unit test the project run the following command in the root of this project:

````
npm run test
````

For end-to-end testing we use Protractor and Jasmine. To e2e test the project first ensure the project is running with `ionic serve`. Next run the following command in the root of this project:

```
npm run e2e
```

For end-to-end testing we use Protractor and Jasmine. To e2e test the project first ensure the project is running with `ionic serve`. Next run the following command in the root of this project. Use the FILE_NAME as variable defined in the e2e script. 

```
npm run e2e -- --params.testFile=<FILE_NAME>
```

Example

```
npm run e2e -- --params.testFile="existing-wallet-overview-check"
```

## Validating translations

To validate if all translations have a definition for all translation keys you can use the following command:

```
npm run validate-translations
```

This will, based on the English translation, check if any translation keys are missing in all other translations.

All missing translation keys will be logged. The original translation will also be amended with the missing translation key and a default value.

This default value will result in an invalid JSON string on purpose. This allows us to easily find missing strings in a code editor.

When running on a build serve you may want to skip amending the translation file. To skip amending use the following command:

```
npm run validate-translations:ci
```

This will only output the errors.

## Generating private and public keys

Private keys are generated based on a 24 word mnemonic sentence. We use [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) to generate a mnemonic sentence and extract a seed from this sentence.

Next we use [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) (using the hierarchical structure defined by the [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) standard) to generate a private key.

Lastly we use a Merkle Signature Scheme to generate private keys which can be used to sign transactions.

For BIP32 we have used code written by Ian Coleman which itself is a port of a Python implementation by Pavol Rusnak. We have adjusted this code to work as an Angular service.

For BIP32/BIP44 we use the [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib). We have used [Browserify](http://browserify.org/) to make this library available for web.

To generate the Browserified version of the bitcoinjs-lib library use the following command in the root of this project:

```
browserify ./bitcoin-js-wrapper/wrapper.js --standalone bitcoinjs > ./src/assets/scripts/bitcoinjs-lib.js
```
