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

## Testing the project

We use Jasmine and Karma to unit test this project. To unit test the project run the following command in the root of this project:

````
npm run test
````

For end-to-end testing we use Protractor and Jasmine. To e2e test the project first ensure the project is running with `ionic serve`. Next run the following command in the root of this project:

```
npm run e2e
```
