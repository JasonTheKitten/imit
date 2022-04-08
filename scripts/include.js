"use strict";

// I had different needs than require.js, to my knowledge, provides, so I rolled my own alternative.

// The `this` keyword doesn't seem to work consistently in JS (unless working with the `class` syntax), so I avoided it here

//TODO: Track circular dependencies (can put a table in `context`) and throw an error if one occurs.
//TODO: Perhaps allow custom handlers to be defined within the context itself

function include_(modules, context) {
    // First, calculate how many modules are not already loading/loaded so that we can report them
    // Then, load all modules and return them

    // Fix context if malformatted
    context.moduleCache ||= {};

    if (!(modules instanceof Array)) {
        throw "Expected array of includes!";
    }

    //TODO: Perform calculations

    // Thanks to Jude from the (unofficial) Java Discord Server for shortening this!
    return Promise.all(modules.map(module => include_.include__(module, context)));
}

include_.handlers = {};
include_.defaultHandler = "js";
include_.moduleLoadingHandler = () => {};
include_.moduleLoadedHandler = () => {};

include_.include__ = function(module, context) {
    if (context.moduleOverrides && context.moduleOverrides[module]) {
        return context.moduleOverrides[module];
    }

    let moduleLookupInfo = include_.resolveModuleLookupInfo(module, context);

    let cachedModule = include_.getModuleCache(moduleLookupInfo, context);
    if (cachedModule) {
        return cachedModule;
    }
    
    return include_.loadModule(moduleLookupInfo, context);
}

include_.resolveModuleLookupInfo = function(module, context) {
    let [handlerName, moduleName, adjustedModuleName] = include_.getModuleHandler(module);
    
    //TODO: Smarter resolve algorithm
    // with symbolic links and path format correction
    // and even a different base path depending on the handler
    let modulePath = (context.handlerPaths || {})[handlerName] || "";
    let resolvedLocation = moduleName;
    if (modulePath) {
        resolvedLocation = modulePath + "/" + resolvedLocation;
    }
    if (context.path) {
        resolvedLocation = context.path + "/" + resolvedLocation;
    }

    return {
        handler: include_.handlers[handlerName],
        location: resolvedLocation,
        name: adjustedModuleName
    };
}

include_.getModuleHandler = function(module) {
    for (let prefix in include_.handlers) {
        if (module.startsWith(prefix + "!")) {
            return [prefix, module.substring(prefix.length + 1), module];
        }
    }

    //TODO: Support a "strict mode"
    return [include_.defaultHandler, module, include_.defaultHandler + "!" + module];
}

include_.getModuleCache = function(moduleLookupInfo, context) {
    let cache = context.moduleCache[moduleLookupInfo.location];
    if (cache == null) {
        return null;
    } if (cache instanceof Promise) {
        return cache;
    } else {
        return Promise.resolve(cache);
    }
}

include_.loadModule = function(moduleLookupInfo, context) {
    include_.moduleLoadingHandler(moduleLookupInfo.name);
    context.moduleCache[moduleLookupInfo.location] =
        moduleLookupInfo.handler(moduleLookupInfo.location, context, moduleLookupInfo)
            // JS is designed to appear mostly single-threaded, so this should *not* cause
            // a race condition between the execution of the `=` in .then and the `=` above.
            // --
            // And regardless, it doesn't really matter as we should get the same result either way
            // (just in one case it would be wrapped in a promise now and in the other case it
            // would be wrapped in a promise in `getModuleCache`)
            .then(result => {
                context.moduleCache[moduleLookupInfo.location] = result;
                include_.moduleLoadedHandler(moduleLookupInfo.name);

                return result;
            });

    return context.moduleCache[moduleLookupInfo.location];
}

include_.registerHandler = function(prefix, handler) {
    include_.handlers[prefix] = handler;
}

include_.setModuleLoadTriggeredHandler = function(handler) {
    //TODO
    throw "Not implemented!";
}

include_.setModuleLoadingHandler = function(handler) {
    include_.moduleLoadingHandler = handler;
}

include_.setModuleLoadedHandler = function(handler) {
    include_.moduleLoadedHandler = handler;
}

//TODO: Error handler

include_.checkFetchStatus = response => {
    if (response.status < 200 || response.status >= 400) {
        throw "Failed to obtain resource! Error Code: " + response.status;
    }
    return response;
};

//TODO: Don't hard code file extensions
include_.registerHandler("js", function(location, context, moduleLookupInfo) {
    return new Promise((resolve, reject) => {
        function checkCode(code) {
            //TODO: Ignore whitespace
            let isStrict = code.startsWith("\"use strict\";") || code.startsWith("'use strict';");
            let isAsm = code.startsWith("\"use asm\";") || code.startsWith("'use asm';");
            if (!isStrict || isAsm) {
                console.warn("Module " + moduleLookupInfo.name + " is not using strict mode.")
            }
        }

        function include(modules) {
            return include_(modules, context);
        }

        //TODO: Also handle case where define called after eval completes
        let defineCalled = false;
        function define(modules, moduleFunc) {
            if (defineCalled) {
                throw "define/defineflat can only be called once";
            }

            defineCalled = true;

            return include(modules)
                .then(moduleHandles => { resolve(moduleFunc(...moduleHandles)) })
                .catch(e => reject(e));
        }

        function defineflat(modules, moduleFunc) {
            if (defineCalled) {
                throw "define/defineflat can only be called once";
            }

            defineCalled = true;

            return include(modules)
                .then(moduleHandles => { moduleFunc(...moduleHandles) })
                .then(results => resolve(results))
                .catch(e => reject(e));
        }

        fetch(location + ".js")
            .then(include_.checkFetchStatus)
            .then(response => response.text())
            .then(code => { checkCode(code); return code; })
            .then(code => (new Function(
                "include", "define", "defineflat",
                code + "//# sourceURL=" + moduleLookupInfo.name)(include, define, defineflat)))
            .catch(e => reject(e))
            .then(_ => {
                if (!defineCalled) {
                    resolve();
                }
            });

    });
});

include_.registerHandler("html", function(location) {
    return fetch(location + ".html")
        .then(include_.checkFetchStatus)
        .then(resp => resp.text())
        .then(html => {
            //NOTE: DOMParser adds extra elements, so we cannot use that
            let el = document.createElement("div");
            el.innerHTML = html;

            return el;
        });
});

include_.registerHandler("css", function(location) {
    return new Promise((resolve, reject) => {
        let styleElement = document.createElement("link");
        styleElement.onload = () => resolve(styleElement);
        styleElement.onerror = reject;
        styleElement.setAttribute("rel", "stylesheet");
        styleElement.setAttribute("href", location + ".css");

        document.head.append(styleElement);
    });
});

include_.registerHandler("text", function(location) {
    return fetch(location + ".txt")
        .then(include_.checkFetchStatus)
        .then(resp => resp.text());
});

include_.registerHandler("json", function(location) {
    return fetch(location + ".json")
        .then(include_.checkFetchStatus)
        .then(resp => resp.json());
});