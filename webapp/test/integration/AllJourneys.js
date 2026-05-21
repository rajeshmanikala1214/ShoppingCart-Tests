// webapp/test/integration/AllJourneys.js
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
    Opa5.extendConfig({
        arrangements: new Startup(),
        viewNamespace: "sap.ui.demo.cart.view.",
        autoWait: true
    });
});