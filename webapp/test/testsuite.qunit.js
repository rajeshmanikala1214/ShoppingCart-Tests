// webapp/test/testsuite.qunit.js
// Used by testsuite.qunit.html (Test Starter / local browser run).
// For Karma/CI, karma-ui5 script mode bypasses this file entirely
// and loads AllTests.js + AllJourneys.js directly.
//
// QUnit version "2.18" specifier REMOVED — it caused:
//   "TypeError: unsupported qunit version 2.18"
// on UI5 versions that don't ship that exact version alias.
// Letting UI5 pick the default QUnit version works for both local and CI.

sap.ui.define(() => {
    "use strict";
    return {
        name: "QUnit test suite for Shopping Cart",
        defaults: {
            // FIX: Point directly to the virtual workspace runner address format
            page: "ui5://sap/ui/demo/cart/test/Test.qunit.html?testsuite={suite}&test={name}",
            ui5: {
                language: "en",
                theme: "sap_horizon"
            },
            loader: {
                paths: {
                    "sap/ui/demo/cart": "../",
                    "sap/ui/demo/mock": "./../localService/mockdata"
                }
            }
        },
        tests: {
            "unit/unitTests": {
                title: "Unit tests for Shopping Cart"
            },
            "integration/opaTestsComponent": {
                title: "OPA5 tests for Shopping Cart with Component"
            }
        }
    };
});