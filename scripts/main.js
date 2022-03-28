{
    requirejs.config({
        baseUrl: "scripts",
        paths: {
            resources: "../resources"
        }
    });

    requirejs(
        ["gui/i18n", "gui/menubar", "gui/tabnav", "gui/contentpane"]
    , function(i18n, menubar, tabnav, contentpane) {
        i18n.setup();
        menubar.setup();
        tabnav.setup();
        contentpane.setup();
    });
}