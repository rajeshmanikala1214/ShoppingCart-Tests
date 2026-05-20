'use strict';

module.exports = function (config) {
  config.set({
 
    basePath:   '',
    frameworks: ['ui5'],
 
    // karma-ui5 in script mode serves all webapp files automatically.
    // The explicit files entry makes webapp/** available at /base/webapp/
    // files: [
    //   { pattern: 'webapp/**', served: true, included: false, watched: false }
    // ],
 
    ui5: {
      // UI5 1.120.23 LTS — compatible with Chrome 99 (Selenium 4.1.2 sidecar).
      // QUnit 2.x is bundled. Does NOT use Promise.withResolvers().
      url: 'https://ui5.sap.com/1.120.23/',
 
      // script mode: karma-ui5 injects the sap-ui-core.js bootstrap,
      // applies config below, then sap.ui.require()s each test module.
      // QUnit.start() is called automatically after all modules load.
      // No HTML file needed. No ui5:// protocol. No Test Starter.
      mode: 'html',
 
      config: {
        async:      true,
        theme:      'sap_horizon',
        language:   'en',
        // Map the app namespace so OPA5 journeys can find Component.js,
        // views, controllers, and mock data via sap.ui.require()
        resourceRoots: {
          'sap.ui.demo.cart': '/base/webapp',
          'sap.ui.demo.mock': '/base/webapp/localService/mockdata'
        }
      },
 
      testpage: 'webapp/test/testsuite.qunit.html',
      // AMD module names (no .js suffix).
      // karma-ui5 calls sap.ui.require() on each, then QUnit.start().
      // These are the new aggregator files you created:
      //   webapp/test/unit/AllTests.js        → all unit test modules
      //   webapp/test/integration/AllJourneys.js → all OPA5 journeys
      // tests: [
      //   'sap/ui/demo/cart/test/unit/AllTests',
      //   'sap/ui/demo/cart/test/integration/AllJourneys'
      // ]
    },
 
    proxies: {
      '/test-resources/sap/ui/demo/cart/': '/base/webapp/test/'
    },
    // Instrument only production sources — exclude test files
    preprocessors: {
      'webapp/!(test)/**/*.js': ['coverage']
    },
 
    // 'sonar-generic' = inline reporter (no extra package needed)
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