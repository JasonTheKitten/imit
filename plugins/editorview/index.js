"use strict";

defineflat([
    "$",
    "gui/i18n",
    "gui/menubar",
    "gui/tabnav",
    "gui/contentpane",
    "html!view",
    "css!view"
], function(appctx, i18n, menubar, tabnav, contentpane, el) {
    appctx.getViewContext().registerView({
        element: el,
        name: "editor"
    });

    menubar.setup();
    tabnav.setup();
    contentpane.setup();
    i18n.setup();

    return {
        handle: {},
        name: "view.editor"
    };
});