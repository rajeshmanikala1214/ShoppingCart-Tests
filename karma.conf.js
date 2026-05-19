/**
 * Karma configuration for SAP UI5 OPA5 / QUnit tests
 * ShoppingCart-Tests repository
 *
 * STATUS AFTER BUILD #38
 * ──────────────────────
 * ✅ Selenium 4.1.2 connects fine (Chrome 99) — W3C protocol works
 * ✅ Karma server starts, browser connects
 * ❌ 0 of 0 tests executed — no tests discovered
 *
 * ROOT CAUSE OF 0 TESTS
 * ──────────────────────
 * karma-ui5 in 'script' mode loaded testsuite.qunit.js successfully,
 * but that module's `page` property is:
 *   "ui5://test-resources/sap/ui/demo/cart/Test.qunit.html?..."
 * The ui5:// protocol is resolved by ui5-tooling's serve middleware.
 * karma-ui5 in script mode does NOT provide that middleware, so the
 * page URL never resolves → no test runner HTML is ever opened →
 * QUnit reports 0 tests.
 *
 * THE FIX
 * ───────
 * Switch to mode: 'html' with testpage pointing to testsuite.qunit.html.
 * In html mode, karma-ui5:
 *   1. Serves the HTML file through its own Connect server
 *   2. Injects the Karma client script into the page
 *   3. Proxies /resources/ and /test-resources/ to the CDN at ui5.url
 *
 * testsuite.qunit.html loads createSuite.js which reads testsuite.qunit.js.
 * The suite then opens each individual test via Test.qunit.html?test=...
 * karma-ui5 intercepts those navigations and runs each test inline.
 *
 * Chrome 99 supports modern JS — we can now use UI5 1.120.23 (LTS) safely.
 * (UI5 1.148+ still requires Chrome 119+ for Promise.withResolvers)
 *
 * INLINE SONARQUBE REPORTER
 * ──────────────────────────
 * karma-sonarqube-unit-reporter crashes on OPA5 results (reads .value on
 * a plain string log entry). Replaced with an inline reporter that writes
 * identical XML. No extra npm package needed.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Inline SonarQube Generic Test Execution reporter ─────────────────────────
function SonarGenericReporter (baseReporterDecorator, config, logger) {
  baseReporterDecorator(this);
  const log        = logger.create('reporter.sonar-generic');
  const outputFile = 'reports/test-execution.xml';
  const fileMap    = {};

  function escapeXml (s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  function msgOf (e) {
    if (!e) return '';
    if (typeof e === 'string') return e;
    return e.message || e.value || JSON.stringify(e);
  }

  function fileOf (result) {
    const s0 = (result.suite && result.suite[0]) || '';
    const m  = s0.match(/[?&]test=([^&]+)/);
    if (m) return 'webapp/test/' + m[1] + '.js';
    const last = (result.suite && result.suite[result.suite.length - 1]) || 'unknown';
    return 'webapp/test/' + last.replace(/\s+/g, '_') + '.js';
  }

  this.onSpecComplete = function (_b, r) {
    const f = fileOf(r), n = escapeXml(r.description || ''), d = r.time || 0;
    let tc;
    if (r.skipped) {
      tc = `    <testCase name="${n}" duration="${d}"><skipped/></testCase>`;
    } else if (!r.success) {
      const e0  = (r.log && r.log[0]) || '';
      const msg = escapeXml(msgOf(e0));
      const det = escapeXml((r.log || []).map(msgOf).join('\n'));
      tc = `    <testCase name="${n}" duration="${d}"><failure message="${msg}">${det}</failure></testCase>`;
    } else {
      tc = `    <testCase name="${n}" duration="${d}"/>`;
    }
    (fileMap[f] = fileMap[f] || []).push(tc);
  };

  this.onRunComplete = function () {
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let xml = '<testExecutions version="1">\n';
    for (const [f, cases] of Object.entries(fileMap)) {
      xml += `  <file path="${escapeXml(f)}">\n${cases.join('\n')}\n  </file>\n`;
    }
    xml += '</testExecutions>\n';
    fs.writeFileSync(outputFile, xml, 'utf8');
    log.info('SonarQube test-execution report → ' + outputFile);
  };
}
SonarGenericReporter.$inject = ['baseReporterDecorator', 'config', 'logger'];

// ─────────────────────────────────────────────────────────────────────────────

module.exports = function (config) {
  config.set({

    basePath:   '',
    frameworks: ['ui5'],
    files:      [],

    ui5: {
      // html mode: karma-ui5 opens the HTML file, injects Karma client,
      // proxies /resources/* and /test-resources/* to the CDN.
      // createSuite.js reads testsuite.qunit.js and opens each test via
      // Test.qunit.html?test=... — karma-ui5 intercepts those and runs them.
      mode:     'html',
      testpage: 'webapp/test/testsuite.qunit.html',

      // UI5 1.120.23 LTS — works on Chrome 99 (Selenium 4.1.2 sidecar).
      // Does NOT use Promise.withResolvers() unlike 1.128+.
      url: 'https://ui5.sap.com/1.120.23/'
    },

    // Instrument only production sources, exclude test files
    preprocessors: {
      'webapp/!(test)/**/*.js': ['coverage']
    },

    reporters: ['progress', 'junit', 'coverage', 'sonar-generic'],

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

    // OPA5 journeys are slow — 7 minutes, 3 reconnect retries
    captureTimeout:             420000,
    browserDisconnectTimeout:   420000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout:   420000,

    colors:              true,
    logLevel:            config.LOG_INFO,
    autoWatch:           false,
    singleRun:           true,
    concurrency:         1,
    forceJSONP:          true,
    failOnEmptyTestSuite: false,
    reportSlowerThan:    500,

    plugins: [
      'karma-ui5',
      'karma-webdriver-launcher',
      'karma-chrome-launcher',
      'karma-junit-reporter',
      'karma-coverage',
      { 'reporter:sonar-generic': ['factory', SonarGenericReporter] }
    ]
  });
};