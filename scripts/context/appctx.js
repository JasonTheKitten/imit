"use strict";

define([
    "js!context/viewctx"
], function(viewCtx) {
    class AppCtx {
        #viewContext = new viewCtx.ViewCtx();
        #accessibilityContext;

        constructor(a11yctx) {
            this.#accessibilityContext = a11yctx;
        }

        getViewContext() {
            return this.#viewContext;
        }

        getAccessibilityContext() {
            return this.#accessibilityContext;
        }
    }

    return {
        AppCtx: AppCtx
    };
});