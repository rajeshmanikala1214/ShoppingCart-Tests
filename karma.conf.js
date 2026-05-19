/**
 * Karma configuration for SAP UI5 OPA5 / QUnit tests
 * Optimized for Cart Application running on Project Piper
 */

'use strict';

module.exports = function (config) {
  config.set({

    // Base path points to root directory where package.json sits
    basePath: '',

    // Frameworks to load. 'ui5' injects qunit automatically
    frameworks: ['ui5'],

    files: [],

    // UI5 framework configuration optimized for Pipeline Execution
    ui5: {
      url: 'https://ui5.sap.com',
      mode: 'script', // 'script' mode is vastly more stable in Docker environments
      config: {
        async: true,
        resourceRoots: {
          'sap.ui.demo.cart': '/base/webapp' // Replace with your exact Component namespace if different
        }
      },
      tests: [
        'sap/ui/demo/cart/test/testsuite.qunit.js'
      ]
    },

    // CRITICAL FIX: Exclude the webapp/test directory from coverage instrumentation
    preprocessors: {
      'webapp/!(test)/**/*.js': ['coverage']
    },

    reporters: ['progress', 'junit', 'coverage', 'sonarqubeUnit'],

    junitReporter: {
      outputDir: 'reports',
      outputFile: 'TESTS-karma.xml',
      suite: 'ShoppingCartOPA5Tests',
      useBrowserName: false,
      classNameFormatter: function (browser, result) {
        return result.suite.join('.');
      }
    },

    coverageReporter: {
      dir: 'reports',
      reporters: [
        { type: 'cobertura', subdir: 'coverage', file: 'coverage.xml' },
        { type: 'lcov',      subdir: 'coverage' },
        { type: 'text-summary' }
      ]
    },

    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      outputFile: 'reports/test-execution.xml',
      overrideTestDescription: true,
      testPaths: [
        'webapp/test/integration',
        'webapp/test/unit'
      ],
      testFilePattern: '.js',
      useBrowserName: false
    },

    port: 9876,
    
    // CRITICAL FIX: Directs selenium back to the node container image interface safely
    hostname: process.env.PIPER_SELENIUM_HOSTNAME || 'karma',
    listenAddress: '0.0.0.0',

    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    failOnEmptyTestSuite: false,

    browsers: ['SeleniumChrome'],

    customLaunchers: {
      SeleniumChrome: {
        base: 'WebDriver',
        config: {
          hostname: process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium',
          port: parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT) || 4444
        },
        browserName: 'chrome',
        name: 'Karma',
        flags: ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
        pseudoActivityInterval: 30000
      }
    },

    client: {
      captureConsole: true,
      clearContext: false
    },

    browserConsoleLogOptions: {
      level: 'debug',
      format: '%b %T: %m',
      terminal: true
    },

    captureTimeout:             210000,
    browserDisconnectTimeout:   210000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout:   210000,

    concurrency: 1,
    forceJSONP: false, // Disabling JSONP forces cleaner modern W3C execution channels

    plugins: [
      'karma-ui5',
      'karma-webdriver-launcher',
      'karma-chrome-launcher',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-sonarqube-unit-reporter'
    ]
  });
};