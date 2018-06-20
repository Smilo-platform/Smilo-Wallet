var webpackConfig = require('./webpack.test.js');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  var _config = {
    basePath: '../',

    frameworks: ['jasmine'],

    files: [
      {
        pattern: './test-config/karma-test-shim.js',
        watched: true
      },
      {
        pattern: './src/assets/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false
      }
    ],

    proxies: {
      '/assets/': '/base/src/assets/'
    },

    preprocessors: {
      './test-config/karma-test-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },

    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },

    reporters: config.coverage ? ['kjhtml', 'dots', 'coverage-istanbul'] : ['kjhtml', 'dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['HeadlessChrome'],

    customLaunchers: {
      HeadlessChrome: {
        base: 'ChromeHeadless',
        browserDisconnectTimeout: 50000,
        browserDisconnectTolerance: 5,
        browserNoActivityTimeout: 90000,
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--proxy-bypass-list=*',
          '--proxy-server=\'direct://\''
       ]
      }
    },

    singleRun: false
  };

  config.set(_config);
};
