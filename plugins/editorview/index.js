define([
    "html!view",
    "css!view"
], function(el) {
    class EditorView {
        getName() {
            return "view.editor";
        }

        load(loaderHandle) {
            let appctx = loaderHandle.appctx;

            appctx.registerView({
                element: el,
                name: "editor"
            });

            return (
                include([
                    "gui/i18n",
                    "gui/menubar",
                    "gui/tabnav",
                    "gui/contentpane"
                ])
                .then(([i18n, menubar, tabnav, contentpane]) => {
                    menubar.setup();
                    tabnav.setup();
                    contentpane.setup();
                    return i18n.setup();
                }));
        }
    }

    return {
        EditorView: EditorView
    };
});