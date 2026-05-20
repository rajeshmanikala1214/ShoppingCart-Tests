sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/demo/cart/test/integration/arrangements/component/Startup", // (or /iframe/Startup for IFrame file)
    "./pages/Home",
    "./pages/Welcome",
    "./pages/Category",
    "./pages/Product",
    "./pages/Cart",
    "./pages/Dialog",
    "./pages/Checkout",
    "./pages/OrderCompleted"
], function (Opa5, Startup) {
    "use strict";

    Opa5.extendConfig({
        arrangements: new Startup(),
        viewNamespace: "sap.ui.demo.cart.view.",
        autoWait: true
    });

    // Run all standard journeys bundled neatly together
    sap.ui.require([
        "sap/ui/demo/cart/test/integration/AllJourneys"
    ], function () {
        QUnit.start();
    });
});