define([], function () {
    let tasks = [];
    let totalTasks = 0;
    let completedTasks = 0;

    let registeredPlugins = [];
    let loadingPluginResolves = {};
    let loadingPlugins = {};
    let pluginHandles = {};

    let progressListener = () => {};

    function registerTask(task) {
        totalTasks++;
        tasks[tasks.length] = task.then(() => {
            completedTasks++;
            progressListener(totalTasks, completedTasks);
        });
    }

    function register(pluginInfo) {
        registeredPlugins[registeredPlugins.length] = pluginInfo;
    }

    function createLoadingPluginPromise(name) {
        loadingPlugins[name] ||= new Promise(
            (resolve) => loadingPluginResolves[name] = resolve);
    }

    function waitForPluginLoaded(name) {
        createLoadingPluginPromise(name)

        return loadingPlugins[name];
    }

    function waitForPluginsLoaded(names) {
        let promises = [];
        let handles = [];
        
        for (let i = 0; i < names.length; i++) {
            let j = i;
            promises[j] = waitForPluginLoaded(names[j])
                .then(handle => handles[j] = handle);
        }

        return Promise.all(promises)
            .then(() => handles);
    }

    function setProgressListener(progressListener_) {
        progressListener = progressListener_;
    }

    function load(appctx) {
        for (let i = 0; i < registeredPlugins.length; i++) {
            let pluginInfo = registeredPlugins[i];
            let pluginName = pluginInfo.plugin.getName();
            let plugin = pluginInfo.plugin;
            
            createLoadingPluginPromise(pluginName);

            let loaderHandle = {
                waitForPluginLoaded: waitForPluginLoaded,
                waitForPluginsLoaded: waitForPluginsLoaded,
                appctx: appctx
            }

            let pluginLoadedPromise = plugin.load(loaderHandle)
                .then(res => res) //TODO: Should we flatten here?
                .then((handle) => {
                    pluginHandles[pluginName] = handle;
                    loadingPluginResolves[pluginName]();
                });

            registerTask(pluginLoadedPromise);
        }

        return Promise.all(tasks);
    }

    return {
        load: load,
        setProgressListener: setProgressListener,
        register: register
    };
});