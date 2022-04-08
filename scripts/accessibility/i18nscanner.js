"use strict";

define([], function() {
    //TODO: Find an alternative to passing contexts around
    function includeWithOptContext(modules, context) {
        if (context != null) {
            return include_(modules, context);
        } else {
            return include(modules);
        }
    }

    function scanLanguagesAvailable(directory, context) {
        return includeWithOptContext(["json!" + directory + "/languages"], context)
            .then(([r]) => r);
    }

    function getLanguages(directory, names, context) {
        if (names == null) {
            return scanLanguagesAvailable(directory, context)
                .then(names => getLanguages(directory, names, context));
        }

        let includes = names.map(name => "json!" + directory + "/" + name);

        return includeWithOptContext(includes, context)
            .then(resolvedLanguages => {
                let languages = {};

                for (let i = 0; i < names.length; i++) {
                    let localeLetters = names[i];
                    languages[localeLetters] = [ resolvedLanguages[i] ];
                }

                return languages;
            });
    }

    return {
        getLanguages: getLanguages
    };
});