"use strict";

define([
    "js!accessibility/i18nscanner"
], function(i18nscanner) {
    class PluginContext {

        #languageProvider;

        constructor(languageProvider) {
            this.#languageProvider = languageProvider;
        }

        getLanguageProvider() {
            return this.#languageProvider;
        }

    }

    function registerPluginHandler(appctx) {
        function adjustContext(newContext, oldContext) {
            newContext.path = newContext.path || oldContext.path;
            newContext.moduleOverrides = oldContext.moduleOverrides;

            let languagePromise;
            if (newContext.languages) {
                languagePromise = i18nscanner.getLanguages(newContext.languages, null, newContext);
            } else {
                languagePromise = Promise.resolve({});
            }

            return languagePromise
                .then(lang => appctx.getAccessibilityContext().createLanguageProvider(lang))
                .then(provider => newContext.moduleOverrides["$$"] = new PluginContext(provider))
                .then(() => newContext);
        }
    
        //TODO: Allow distinguishing between module cache in global cache
        // in include.js so that we won't need this
        let pluginCache = [];
        
        include_.registerHandler("plugin", function(location, context_) {
            if (pluginCache[location]) {
                return Promise.resolve(pluginCache[location]);
            }

            let initContext = {
                path: location,
                moduleOverrides: {
                    "$": appctx
                }
            }
            return include_(["json!manifest"], initContext)
                .then(([context]) => adjustContext(context, initContext))
                .then(context => include_(["../index"], context)) //TODO: Allow use of base URL
                .then(([handle]) => handle)
                .then(handle => {
                    pluginCache[location] = handle;
                    return handle;
                });
        });
    }

    return { registerPluginHandler: registerPluginHandler };
});