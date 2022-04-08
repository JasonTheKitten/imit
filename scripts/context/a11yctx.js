"use strict";

define([
    "accessibility/i18n"
], function(i18n) {
    class AccessibilityContext {
        
        #baseLanguageProvider; //TODO: Set this
        #registeredLanguageProviders = [this.#baseLanguageProvider];

        constructor(baseLanguageProvider) {
            this.#baseLanguageProvider = baseLanguageProvider;
        }

        //TODO: Should there also be a relevant deregister method?
        //TODO: Allow the base provider to be overriden
        createLanguageProvider(languages) {
            let languageProvider = new i18n.LanguageProvider(languages, this.#baseLanguageProvider);
            this.#registeredLanguageProviders.push(languageProvider);

            return languageProvider;
        }

        setLanguage(lang) {
            for (let i = 0; i < this.#registeredLanguageProviders.length; i++) {
                let languageProvider = this.#registeredLanguageProviders[i];
                languageProvider.preferLanguages([lang, "en_US"]);
            }
        }

    }

    return { AccessibilityContext: AccessibilityContext };
});