/**
 * Karma configuration for SAP UI5 OPA5 / QUnit tests
 * ShoppingCart-Tests repository
 *
 * KEY DESIGN DECISION — why "script" mode with "tests" array
 * ──────────────────────────────────────────────────────────
 * The repo has NO standalone OPA5 HTML bootstrap files.
 * All HTML files (Test.qunit.html, testsuite.qunit.html) use the modern
 * UI5 Test Starter (runTest.js / createSuite.js / ui5:// protocol) which
 * requires a running ui5-tooling server — unavailable inside the Karma +
 * Selenium Docker network → silent hang → timeout.
 *
 * karma-ui5 "script" mode solves this cleanly:
 *   • karma-ui5 itself starts an HTTP server and proxies /resources/ and
 *     /test-resources/ to the configured CDN URL.
 *   • It injects the UI5 bootstrap script tag automatically.
 *   • The `tests` array lists AMD module names (no .js suffix, no HTML needed).
 *   • karma-ui5 calls sap.ui.require() on each module in sequence, then
 *     calls QUnit.start() — exactly what a hand-written HTML page would do.
 *
 * No new files are created. No existing files are modified.
 * Only karma.conf.js and package.json (for devDependencies) are added.
 */

'use strict';

module.exports = function (config) {
  config.set({

    basePath: '',

    // karma-ui5 registers the 'ui5' framework which boots the UI5 runtime
    // and proxies CDN resources — no separate server needed.
    frameworks: ['ui5'],

    files: [],  // karma-ui5 handles all serving

    // ── karma-ui5 configuration ───────────────────────────────────────────────
    ui5: {
      // "script" mode: karma-ui5 injects the sap-ui-core.js bootstrap tag,
      // then sap.ui.require()-s each module listed in `tests`.
      // No HTML testpage file is needed.
      mode: 'script',

      // CDN URL — must match minUI5Version in manifest.json (1.148.0).
      // karma-ui5 proxies GET /resources/* and /test-resources/* here so
      // Chrome can load sap-ui-core.js inside the Docker network.
      url: 'https://ui5.sap.com/1.148.0/',

      // UI5 bootstrap parameters injected by karma-ui5
      config: {
        theme:              'sap_horizon',
        language:           'en',
        compatVersion:      'edge',
        preload:            'async',
        frameOptions:       'deny',
        libs:               'sap.m,sap.f,sap.ui.core',
        // Map the app namespace and mock data so OPA5 journeys can find them
        resourceroots: JSON.stringify({
          'sap.ui.demo.cart': '../../../webapp',
          'sap.ui.demo.mock': '../../../webapp/localService/mockdata'
        })
      },

      // AMD module names (no .js suffix) to load and run.
      // karma-ui5 calls sap.ui.require() on each one, then QUnit.start().
      // We use opaTestsComponent — Component-based journeys are the most
      // reliable in headless CI (no iFrame, no FLP shell).
      tests: [
        'sap/ui/demo/cart/test/integration/opaTestsComponent.qunit'
      ]
    },

    preprocessors: {
      'webapp/**/*.js': ['coverage']
    },

    reporters: ['progress', 'junit', 'coverage', 'sonarqubeUnit'],

    junitReporter: {
      outputDir:      'reports',
      outputFile:     'TESTS-karma.xml',
      suite:          'ShoppingCartOPA5Tests',
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

    // Generates reports/test-execution.xml in SonarQube Generic Test Execution
    // format — consumed by sonar.testExecutionReportPaths
    sonarQubeUnitReporter: {
      sonarQubeVersion:        'LATEST',
      outputFile:              'reports/test-execution.xml',
      overrideTestDescription: true,
      testPaths: [
        'webapp/test/integration',
        'webapp/test/unit'
      ],
      testFilePattern: '.js',
      useBrowserName:  false
    },

    port:     9876,
    hostname: process.env.PIPER_SELENIUM_HOSTNAME || '0.0.0.0',

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

    // OPA5 journeys are slow — 7 minutes per session, 3 reconnect retries
    captureTimeout:             420000,
    browserDisconnectTimeout:   420000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout:   420000,

    colors:           true,
    logLevel:         config.LOG_INFO,
    autoWatch:        false,
    singleRun:        true,
    concurrency:      1,
    forceJSONP:       true,
    reportSlowerThan: 500,

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