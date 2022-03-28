define([], function() {
    function addTabNavSupport(element) {
        element.setAttribute("tabindex", 0);
    }

    function setup() {
        let elements = document.getElementsByClassName("tabnav");
        for (let i = 0; i < elements.length; i++) {
            addTabNavSupport(elements[i]);
        }
    }

    return {
        setup: setup,
        addTabNavSupport: addTabNavSupport
    };
});