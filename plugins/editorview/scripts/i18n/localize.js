define([], function() {
    function localize(str, label) {
        if (str instanceof Element) {
            str.setAttribute("label", label);
            str.textContent = localize(label);
            return;
        }

        if (!localize.lang || !localize.lang[str]) {
            return str;
        }

        return localize.lang[str];
    };
    localize.setLanguage = function(lang) {
        localize.lang = lang;

        let elements = document.getElementsByClassName("localized");
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.textContent = localize(element.getAttribute("label"));
        }
    };

    return localize;
});