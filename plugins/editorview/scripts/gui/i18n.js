define([
    "i18n/localize",
    "gui/menu"
], function(localize, menuCreator) {
    let languages = {}
    let cachedLanguages = {};

    function setLocale(localeLetters) {
        localize.setLanguage(cachedLanguages[localeLetters]);
    }

    function fetchLanguages() {
        let includes = [];
        for (let i = 0; i < languages.languages.length; i++) {
            includes[i] = "json!../../../resources/locale/" + languages.languages[i];
        }

        return include(includes)
            .then(resolvedLanguages => {
                for (let i = 0; i < languages.languages.length; i++) {
                    let localeLetters = languages.languages[i];
                    cachedLanguages[localeLetters] = resolvedLanguages[i];
                }
            });
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
        return include(["json!../../../resources/locale/languages"])
            .then(([languages_]) => {
                languages = languages_;
                fetchLanguages()
                    .then(() => {
                        setLocale(languages.default)
                        setupI18nButton()
                    });
            });
    }

    return { setup: setup };
});