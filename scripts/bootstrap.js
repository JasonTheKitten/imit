"use strict";

window.addEventListener("load", function() {
    let context = {
        path: "",
        handlerPaths: {
            js: "scripts",
            css: "styles",
            plugin: "plugins"
        }
    }

    // Configure splash screen progress indicator
    let loadedModules = 0;
    let totalModules = 0;

    function updateSplashScreen() {
        let frac = loadedModules / totalModules;
        let percent = frac * 100;
    
        document.getElementById("loading-view-splash-loading-bar-inner")
            .style["width"] = percent + '%';
        document.getElementById("loading-view-splash-loading-bar-text")
            .innerText = "Loading... (" + loadedModules + "/" + totalModules + ")";
    }

    include_.setModuleLoadingHandler(name => {
        console.log("Loading module " + name);
        totalModules++;
        updateSplashScreen();
    });

    include_.setModuleLoadedHandler(name => {
        console.log("Loaded module " + name);
        loadedModules++;
        updateSplashScreen();
    });

    include_(["js!main", "js!plugin"], context)
        .then(([main, plugin]) => {
            return main.createAppContext()
                .then(appctx => {
                    plugin.registerPluginHandler(appctx);
                    main.exec(appctx);
                });
        });
});