"use strict";

define([], function() {
    class LanguageProvider {
        
        #parent;
        #cache;
        #languages;
        #languageNames;

        constructor(languages, parent) {
            this.#languages = languages;
            this.#parent = parent;
            this.#cache = {};
            this.#languageNames = this._computeLanguageNames();
        }

        translate(label) {
            for (let i = 0; i < this.#languageNames.length; i++) {
                let langName = this.#languageNames[i];
                let text = this._translate(label, langName);

                if (text) {
                    return text;
                }
            }

            return label;
        }

        preferLanguages(preferredLanguages) {
            for (let i = preferredLanguages.length - 1; i >= 0; i--) {
                this._bringToTop(preferredLanguages[i]);
            }
        }

        getAvailableLanguages() {
            return this.#languageNames;
        }

        _translate(label, lang) {
            let cachedResult = this._getFromCache(label, lang);
            if (cachedResult) {
                return cachedResult;
            }

            let result = this._lookup(label, lang);
            this._cache(lang, label, result);

            return result;
        }

        _bringToTop(language) {
            let id = this.#languageNames.indexOf(language);
            if (id == -1) {
                return;
            }

            this.#languageNames.splice(id, 1);
            this.#languageNames.unshift(language);
        }

        _getFromCache(label, lang) {
            if (this.#cache[lang] && this.#cache[lang][label]) {
                return this.#cache[lang][label];
            }

            return null;
        }

        _cache(lang, label, text) {
            this.#cache[lang] ||= {};
            this.#cache[lang][label] = text;
        }

        _lookup(label, lang) {
            if (this.#languages[lang]) {
                let languageSet = this.#languages[lang];
                for (let i = 0; i < languageSet.length; i++) {
                    let langResolvers = languageSet[i];
                    let result = (langResolvers instanceof Function) ?
                        langResolvers(label):
                        langResolvers[label];
                        
                    if (result) {
                        return result;
                    }
                }
            }

            if (this.#parent) {
                let parentResult = this.#parent._translate(label, lang);
                if (parentResult) {
                    return parentResult;
                }
            }

            return null;
        }

        _computeLanguageNames() {
            let languageNames = [];
            if (this.#parent) {
                languageNames = this.#parent.getAvailableLanguages().map(v => v);
            }

            for (let lang in this.#languages) {
                if (languageNames.indexOf(lang) == -1) {
                    languageNames[languageNames.length] = lang;
                }
            }

            return languageNames;
        }

    }

    return { LanguageProvider: LanguageProvider };
});