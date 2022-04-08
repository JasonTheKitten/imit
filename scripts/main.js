"use strict";

//NOTE: Plugins cannot be loaded outside of exec, as the system has not yet
//  been initialized before than.
define([
    "context/appctx",
    "context/a11yctx",
    "accessibility/i18n",
    "accessibility/i18nscanner",
], function(appCtx, a11yCtx, i18n, i18nscanner) {
    function createBaseLanguageProvider() {
        return i18nscanner
            .getLanguages("resources/languages")
            .then(languages => new i18n.LanguageProvider(languages));
    }

    function createA11yContext() {
        return createBaseLanguageProvider()
            .then(languageProvider => new a11yCtx.AccessibilityContext(languageProvider))
    }

    function createAppContext() {
        return createA11yContext()
            .then(a11yctx => new appCtx.AppCtx(a11yctx));
    }

    function exec(appctx) {
        function scanPlugins(safemode) {
            return ["plugin!editorview", "plugin!colorpicker"];
        }

        return include(scanPlugins())
            //TODO: Collect plug-in names and stuff
            .then(_ => appctx.getViewContext().setActiveView("editor"));
    }

    return {
        exec: exec,
        createAppContext: createAppContext
    };
});