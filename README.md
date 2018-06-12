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

Make sure you start the mock API for data to retrieve 

```
json-server --watch ./test-config/json-mocks/mock-data.json
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

For end-to-end testing we use Protractor and Jasmine. To e2e test the project first ensure the project is running with `ionic serve`. Next run the following command in the root of this project. Use the FILE_NAME as variable defined in the e2e script. 

```
npm run e2e -- --params.testFile=<FILE_NAME>
```

Example

```
npm run e2e -- --params.testFile="existing-wallet-overview-check"
```
