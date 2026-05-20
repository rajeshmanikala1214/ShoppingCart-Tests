'use strict';

module.exports = function (config) {
  config.set({

    basePath:   '',
    frameworks: ['ui5'],

    // Ensure all webapp assets are served properly under the /base/ namespace
     files: [
      {
        pattern: 'webapp/test/**/*.js',
        included: false,
        served: true,
        watched: false
      }
    ],

    ui5: {
      // Use the absolute, standard OpenUI5 public endpoint
     url: 'https://ui5.sap.com/1.120.23/',

      // Use script mode to prevent background XMLHttpRequest file-parsing failures
      mode: 'script',

      config: {
        async:      true,
        theme:      'sap_horizon',
        language:   'en',
        resourceRoots: {
            'sap.ui.demo.cart': './webapp'
        }
      },

      // Use your aggregator test modules directly
      tests: [
       'test/testsuite.qunit'
      ]
    },

    // Instrument only production sources — exclude test files
    preprocessors: {
      'webapp/!(test)/**/*.js': ['coverage']
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