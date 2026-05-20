// webapp/test/unit/unitTests.qunit.js
// Entry point for unit tests when run via the Test Starter (local browser).
// For Karma/CI, karma-ui5 uses AllTests.js directly — this file is not loaded.

sap.ui.require([
    "sap/ui/demo/cart/test/unit/AllTests"
], function () {
    "use strict";
    QUnit.start();
});