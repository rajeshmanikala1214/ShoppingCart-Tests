'use strict';

module.exports = function (config) {
  config.set({

    basePath:   '',
    frameworks: ['ui5'],

    // FIX 1: Provide explicit, separate file matching rules for reliability in containers
    files: [
      { pattern: 'webapp/**/*.js', served: true, included: false, watched: false },
      { pattern: 'webapp/**/*.xml', served: true, included: false, watched: false },
      { pattern: 'webapp/**/*.json', served: true, included: false, watched: false },
      { pattern: 'webapp/**/*.properties', served: true, included: false, watched: false }
    ],

    ui5: {
      // Use the absolute, standard OpenUI5 public endpoint
      url: 'https://sapui5.hana.ondemand.com',

      // Use script mode to prevent background XMLHttpRequest file-parsing failures
      mode: 'script',

      config: {
        async:      true,
        theme:      'sap_horizon',
        language:   'en',
        // FIX 1: Map the exact namespace resource root that your app and journeys expect
        resourceRoots: {
          'sap.ui.demo.cart': '/base/webapp'
        }
      },

      // FIX 2: Point Karma's native module triggers to match that exact namespace path mapping
      tests: [
        'sap/ui/demo/cart/test/unit/AllTests',
        'sap/ui/demo/cart/test/integration/AllJourneys'
      ]
    },

    // Instrument only production sources — exclude test files
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
      'karma-webdriver-launcher',
      'karma-chrome-launcher',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-sonarqube-unit-reporter'
    ]
  });
};