"use strict";

define([
    "$",
    "gui/menu"
], function(appctx, menuCreator) {
    let languages = {}
    let cachedLanguages = {};

    function setLocale(localeLetters) {
        localize.setLanguage(cachedLanguages[localeLetters]);
    }

    function setupI18nButton() {
        let menuButton = document.getElementById("language-menu-button")

        let menuItems = {};
        for (let i = 0; i < languages.languages.length; i++) {
            let localeLetters = languages.languages[i];
            let lang = cachedLanguages[localeLetters];
            menuItems[
                lang["i18n.name"] + " (" + localeLetters + ")"
            ] = () => setLocale(localeLetters);
        }

        menuButton.addEventListener("click",
            (e) => menuCreator.createMenu(
                menuButton, menuItems, "language-menu", menuCreator.UP_LEFT));
    }  

    function setup() {
        /*setLocale(languages.default);
        setupI18nButton();*/
    }

    return { setup: setup };
});