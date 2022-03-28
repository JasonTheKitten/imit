define(["i18n/localize", "gui/menu"], function(localize, menuCreator) {
    let languages = {}
    let cachedLanguages = {};

    function fetchJson(file) {
        return fetch(file)
            .then(r => r.json());
    }

    function resolveLocale(localeLetters) {
        if (cachedLanguages[localeLetters]) {
            return Promise.resolve(cachedLanguages[localeLetters]);
        }

        return fetchJson("resources/locale/" + localeLetters + ".json")
            .then(lang => {
                cachedLanguages[localeLetters] = lang;
                return lang;
            });
    }

    function setLocale(localeLetters) {
        return resolveLocale(localeLetters)
            .then(lang => localize.setLanguage(lang))
    }

    function setupI18nButton() {
        let menuButton = document.getElementById("language-menu-button")

        let promises = [];
        let menuItems = {};
        for (let i = 0; i < languages.languages.length; i++) {
            let langLetters = languages.languages[i];
            promises[promises.length] = resolveLocale(langLetters)
                .then(lang => menuItems[
                    lang["i18n.name"] + " (" + langLetters + ")"
                ] = () => setLocale(langLetters));
        }

        Promise.all(promises).then(_ =>
            menuButton.addEventListener("click",
                (e) => menuCreator.createMenu(
                    menuButton, menuItems, "language-menu", menuCreator.UP_LEFT)));
    }

    

    function setup() {
        fetchJson("resources/locale/languages.json")
            .then(languages_ => {
                languages = languages_;
                setupI18nButton();
                return setLocale(languages.default);
            });
    }

    return { setup: setup };
});