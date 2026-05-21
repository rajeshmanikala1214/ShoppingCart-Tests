// webapp/test/integration/AllJourneys.js
// Aggregator for all OPA5 journey modules.
// Loaded by karma-ui5 via sap.ui.require() in script mode.
// Each journey registers its opaQunit() calls when loaded.

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/demo/cart/test/integration/arrangements/component/Startup",
    "sap/ui/demo/cart/test/integration/WelcomeJourney",
    "sap/ui/demo/cart/test/integration/NavigationJourney",
    "sap/ui/demo/cart/test/integration/FilterJourney",
    "sap/ui/demo/cart/test/integration/ComparisonJourney",
    "sap/ui/demo/cart/test/integration/PhoneNavigationJourney",
    "sap/ui/demo/cart/test/integration/BuyProductJourney",
	"sap/ui/demo/cart/test/integration/DeleteProductJourney"
], function (Opa5, Startup) {
    "use strict";

    // Configure OPA5 globally for the Component-based test approach.
    // This matches what opaTestsComponent.qunit.js sets up.
    Opa5.extendConfig({
        arrangements:    new Startup(),
        viewNamespace:   "sap.ui.demo.cart.view.",
        autoWait:        true
    });
    // karma-ui5 calls QUnit.start() automatically after all modules load.
});