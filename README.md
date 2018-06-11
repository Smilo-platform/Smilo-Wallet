# Smilo Wallet

## Project dependencies

This project relies on the following dependencies:
- NodeJS @ 8.11.2
- NPM @ 5.6.0
- Ionic @ 3.20.0
- Cordova @ 8.0.0

## Building and running the project

First make sure you have all Node modules installed by running the following command in the root of this project:

```
npm install
```

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

## Testing the project

We use Jasmine and Karma to unit test this project. To unit test the project run the following command in the root of this project:

````
npm run test
````

For end-to-end testing we use Protractor and Jasmine. To e2e test the project first ensure the project is running with `ionic serve`. Next run the following command in the root of this project:

```
npm run e2e
```
