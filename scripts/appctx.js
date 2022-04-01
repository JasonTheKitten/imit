define([], function() {
    class AppCtx {
        registerView(view) {
            let viewContainer = document.getElementById("views");
            let viewElement = view.element;
            viewElement.classList = "view";
            viewElement.setAttribute("name", view.name);
            viewContainer.appendChild(viewElement);
        }

        setActiveView(name) {
            let viewContainer = document.getElementById("views");
            for (let i = 0; i < viewContainer.children.length; i++) {
                let el = viewContainer.children[i];
                if (el.getAttribute("name") == name) {
                    el.classList.add("selected");
                } else {
                    el.classList.remove("selected");
                }
            }
        }
    }

    return {
        AppCtx: AppCtx
    };
});