define([
    "loader",
    "appctx",
    "plugin!editorview"
], function(loader, appCtx, editorView) {
    return {exec: function() {
        let appctx = new appCtx.AppCtx();

        loader.register({
            plugin: new editorView.EditorView(),
            dir: "plugins/editorview/"
        });

        loader.load(appctx).then(() => {
            appctx.setActiveView("editor");
        });
    }};
});