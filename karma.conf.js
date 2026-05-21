'use strict';

module.exports = function (config) {
  config.set({

    basePath:   '',
    // Cleaned up: Removed mocha and browserify to prevent context lockups
    frameworks: ['ui5', 'qunit'],

    // FIX 2: Correct file matching pattern syntax to serve your webapp directory
    files: [
      { pattern: 'webapp/**', served: true, included: false, watched: false }
    ],

    ui5: {
      url: 'https://ui5.sap.com',
      mode: 'script',
      config: {
        async: true,
        resourceRoots: {
          // Point these directly to the mapped asset structure
          'sap.ui.demo.cart': '/base/webapp',
          'sap.ui.demo.cart.test': '/base/webapp/test'
        }
      },
      tests: [
        "sap/ui/demo/cart/test/unit/AllTests",
        "sap/ui/demo/cart/test/integration/AllJourneys"
  ]
    },

    preprocessors: {
      'webapp/model/**/*.js': ['coverage'],
      'webapp/controller/**/*.js': ['coverage']
    },

    reporters: ['progress', 'junit', 'coverage', 'sonarqubeUnit'],

    junitReporter: {
      outputDir:      'reports',
      outputFile:     'TESTS-karma.xml',
      suite:          'ShoppingCartTests',
      useBrowserName: false
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
    testPaths: ['webapp/test'],       
    testFilePattern: '.js',
    useBrowserName: false
    },

    port:          9876,
    hostname:      process.env.PIPER_SELENIUM_HOSTNAME || '0.0.0.0',
    listenAddress: '0.0.0.0',

    browsers: ['SeleniumChrome'],

    customLaunchers: {
      SeleniumChrome: {
        base: 'WebDriver',
        config: {
          hostname: process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium',
          port:     parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT, 10) || 4444
        },
        browserName:            'chrome',
        name:                   'Karma',
         flags: ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
        pseudoActivityInterval: 30000
      }
    },

    client: {
      captureConsole: true,
      clearContext:   false
    },

    browserConsoleLogOptions: {
      level:    'warn',
      format:   '%b %T: %m',
      terminal: true
    },

    captureTimeout:             420000,
    browserDisconnectTimeout:   420000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout:   420000,

    colors:              true,
    logLevel:            config.LOG_INFO,
    autoWatch:           false,
    singleRun:           true,
    failOnEmptyTestSuite: false,
    concurrency:         1,
    forceJSONP:          false,
    reportSlowerThan:    500,

    plugins: [
      'karma-ui5',
      'karma-qunit',
      'karma-chrome-launcher',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-webdriver-launcher',
      'karma-sonarqube-unit-reporter'
    ]
  });
};