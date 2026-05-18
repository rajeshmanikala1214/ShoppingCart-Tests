/**
 * Karma configuration for SAP UI5 OPA5 / QUnit tests
 *
 * Runs via piper step: karmaExecuteTests
 *   runCommand: "npm run test:karma"
 *   sidecarImage: "selenium/standalone-chrome:3.141.59"
 *   sidecarName: "selenium"
 *
 * Reports generated:
 *   reports/TESTS-karma.xml           – JUnit  (for testsPublishResults / Jenkins)
 *   reports/test-execution.xml        – SonarQube Generic Test Execution format
 *   reports/coverage/lcov.info        – LCOV   (sonar.javascript.lcov.reportPaths)
 *   reports/coverage/coverage.xml     – Cobertura (sonar.coverageReportPaths via cobertura)
 */

'use strict';

module.exports = function (config) {
  config.set({

    // ── Base path ──────────────────────────────────────────────────────────────
    // Resolve all file/URL paths relative to the project root so that UI5
    // resources under webapp/ are accessible.
    basePath: '',

    // ── Frameworks ────────────────────────────────────────────────────────────
    // ui5 framework adapter boots the UI5 runtime and hands control to QUnit /
    // OPA5.  The 'qunit' framework is included automatically by the ui5 adapter.
    frameworks: ['ui5'],

    // ── Files ─────────────────────────────────────────────────────────────────
    // The UI5 Karma adapter discovers test files via karma-ui5 configuration
    // below; the `files` array stays empty so Karma does not try to serve
    // raw module files a second time.
    files: [],

    // ── UI5 / Karma-UI5 adapter config ────────────────────────────────────────
    ui5: {
        configPath: 'ui5.yaml',
        mode: 'script',
        tests: [
            'webapp/test/integration/opaTests'
        ],
        url: 'https://ui5.sap.com'
    },

    // ── Preprocessors ─────────────────────────────────────────────────────────
    // Coverage instrumentation on all webapp JS sources (excluding test/ and
    // generated artefacts).  The ui5 adapter serves files through its own
    // middleware so we instrument the pattern it exposes.
    preprocessors: {
      'webapp/**/*.js': ['coverage']
    },

    // ── Reporters ─────────────────────────────────────────────────────────────
    reporters: ['progress', 'junit', 'coverage', 'sonarqubeUnit'],

    // ── JUnit reporter ────────────────────────────────────────────────────────
    junitReporter: {
      outputDir: 'reports',
      outputFile: 'TESTS-karma.xml',
      suite: 'ShoppingCartOPA5Tests',
      useBrowserName: false,
      // Each OPA5 journey maps to its own classname so SonarQube can group
      // test results by module.
      classNameFormatter: function (browser, result) {
        // result.suite is an array; join with '.' for a dotted classname
        return result.suite.join('.');
      }
    },

    // ── Coverage reporter ─────────────────────────────────────────────────────
    coverageReporter: {
      dir: 'reports',
      reporters: [
        // Cobertura XML → sonar.coverageReportPaths / testsPublishResults cobertura
        { type: 'cobertura', subdir: 'coverage', file: 'coverage.xml' },
        // LCOV → sonar.javascript.lcov.reportPaths
        { type: 'lcov',      subdir: 'coverage' },
        // Human-readable summary in the build log
        { type: 'text-summary' }
      ]
    },

    // ── SonarQube Generic Test Execution reporter ─────────────────────────────
    // Produces reports/test-execution.xml in the format:
    //   <testExecutions version="1">
    //     <file path="webapp/test/...">
    //       <testCase name="..." duration="..."/>
    //     </file>
    //   </testExecutions>
    // which is consumed by sonar.testExecutionReportPaths
    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      outputFile: 'reports/test-execution.xml',
      overrideTestDescription: true,
      // The path prefix that maps test results back to source files in the
      // SonarQube project.  OPA5 journeys live under webapp/test/integration/
      // and unit tests under webapp/test/unit/.
      testPaths: [
        'webapp/test/integration',
        'webapp/test/unit'
      ],
      testFilePattern: '.js',
      useBrowserName: false
    },

    // ── Server ────────────────────────────────────────────────────────────────
    port: 9876,
    // 0.0.0.0 so Selenium (sidecar container) can reach Karma on the
    // PIPER_SELENIUM_HOSTNAME host entry injected by karmaExecuteTests.
    hostname: process.env.PIPER_SELENIUM_HOSTNAME || '0.0.0.0',

    // ── Browser / launcher ────────────────────────────────────────────────────
    browsers: ['SeleniumChrome'],

    customLaunchers: {
      SeleniumChrome: {
        base: 'WebDriver',
        config: {
          hostname: process.env.PIPER_SELENIUM_WEBDRIVER_HOSTNAME || 'selenium',
          port: parseInt(process.env.PIPER_SELENIUM_WEBDRIVER_PORT, 10) || 4444
        },
        browserName: 'chrome',
        name: 'Karma',
        // Flags forwarded to ChromeOptions by selenium-webdriver
        pseudoActivityInterval: 30000
      }
    },

    // ── Timeouts ──────────────────────────────────────────────────────────────
    // OPA5 journeys can be slow; give them plenty of breathing room.
    captureTimeout:             210000,
    browserDisconnectTimeout:   210000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout:   210000,

    // ── Misc ──────────────────────────────────────────────────────────────────
    colors:    true,
    logLevel:  config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: 1,
    // JSONP avoids cross-origin issues when Karma serves the iframe context
    forceJSONP: true,
    reportSlowerThan: 500,

    // ── Plugins ───────────────────────────────────────────────────────────────
    plugins: [
      // UI5 adapter – boots the SAPUI5 runtime inside Karma
      'karma-ui5',
      // WebDriver launcher – connects to the Selenium sidecar
      'karma-webdriver-launcher',
      // Chrome launcher kept as a local fallback (not used in CI)
      'karma-chrome-launcher',
      // Reporters
      'karma-junit-reporter',
      'karma-coverage',
      'karma-sonarqube-unit-reporter'
    ]
  });
};