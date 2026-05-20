// webapp/test/unit/AllTests.js
// Aggregator for all unit test modules.
// karma-ui5 in script mode loads this via sap.ui.require(),
// which in turn loads every individual test module.
// QUnit.start() is called by karma-ui5 after all modules finish loading.

sap.ui.define([
    "sap/ui/demo/cart/test/unit/controller/Checkout.controller",
    "sap/ui/demo/cart/test/unit/helper/FakeI18nModel",
    "sap/ui/demo/cart/test/unit/model/EmailType",
    "sap/ui/demo/cart/test/unit/model/formatter",
    "sap/ui/demo/cart/test/unit/model/LocalStorageModel",
    "sap/ui/demo/cart/test/unit/model/models"
], function () {
    "use strict";
    // All QUnit tests are registered by the modules above.
    // karma-ui5 calls QUnit.start() automatically.
});