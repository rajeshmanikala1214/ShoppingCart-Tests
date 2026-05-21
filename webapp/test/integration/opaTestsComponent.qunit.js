sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/demo/cart/test/integration/arrangements/component/Startup",
    "./pages/Home",
    "./pages/Welcome",
    "./pages/Category",
    "./pages/Product",
    "./pages/Cart",
    "./pages/Dialog",
    "./pages/Checkout",
    "./pages/OrderCompleted",
    "sap/ui/demo/cart/test/integration/AllJourneys" // Bundled into the main dependency array
], function (Opa5, Startup) {
    "use strict";

    Opa5.extendConfig({
        arrangements: new Startup(),
        viewNamespace: "sap.ui.demo.cart.view.",
        autoWait: true
    });
    
    // Manual nested sap.ui.require and QUnit.start() REMOVED
});