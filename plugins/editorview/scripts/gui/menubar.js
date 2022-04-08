"use strict";

define([
    "$$",
    "gui/menu",
], function(pluginctx, menuCreator) {
    let languageProvider = pluginctx.getLanguageProvider();

    function createMenuButton(label, options) {
        let menubarMenusElement = document.getElementById("menubar-menus");

        let menuButton = document.createElement("div");
        menuButton.classList = "mb-label localized";
        menuButton.innerText = languageProvider.translate(label);

        menuButton.addEventListener("click",
            _ => menuCreator.createMenu(menuButton, options, "mb-menu", menuCreator.DOWN_RIGHT, l => languageProvider.translate(l)));
        
        menubarMenusElement.append(menuButton);
    }

    return {
        setup: function() {
            createMenuButton("menubar.menus.file", {
                "menubar.menus.file.new": 1,
                "menubar.menus.file.open": 1,
                "menubar.menus.file.save": 1,
                "menubar.menus.file.saveas": 1,
                "menubar.menus.file.copyto": 1
            });

            createMenuButton("menubar.menus.learn", {
                "menubar.menus.learn.manual": 1,
                "menubar.menus.learn.drawabox": function() {
                    window.open("https://drawabox.com/");
                }
            });
        }
    }
})