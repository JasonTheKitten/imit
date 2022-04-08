"use strict";

define([], function() {
    let UP_LEFT = 1,
        UP_RIGHT = 2,
        DOWN_LEFT = 3,
        DOWN_RIGHT = 4

    //TODO: Shorten param list
    //TODO: Break this function up
    //TODO: Support tabnav
    function createMenu(parent, options, cls, direction, transform) {
        transform = transform || (t => t);

        let menuElement = document.createElement("div");
        menuElement.classList = cls;
        document.body.append(menuElement);

        for (let option in options) {
            let menuItemElement = document.createElement("div");
            menuItemElement.innerText = transform(option);
            menuItemElement.classList = "menu-item";
            if (options[option] instanceof Function) {
                menuItemElement.addEventListener("click", options[option]);
            }
            menuElement.append(menuItemElement);
        }

        let menuRect = menuElement.getClientRects()[0];
        let menuWidth = menuRect.right - menuRect.left;
        let menuHeight = menuRect.bottom - menuRect.top;

        let parentRect = parent.getClientRects()[0];
        let parentWidth = parentRect.right - parentRect.left;

        let menuX = parentRect.left;
        if (direction == UP_LEFT || direction == DOWN_LEFT) {
            if (menuWidth > parentWidth) {
                menuX = parentRect.right - parentWidth;
            } else {
                menuElement.style.width = parentWidth + "px";
            }
        } else if (menuWidth < parentWidth) {
            menuElement.style.width = parentWidth + "px";
        }
        menuElement.style.left = menuX + "px";

        let menuY = parentRect.bottom;
        if (direction == UP_LEFT || direction == UP_RIGHT) {
            menuY = parentRect.top - menuHeight;
        }
        menuElement.style.top = menuY + "px";

        let clickListener = (e) => {
            document.body.removeChild(menuElement);
            document.removeEventListener("click", clickListener);
        };
        
        setTimeout(_ =>
            document.addEventListener("click", clickListener), 0);
    }

    return {
        createMenu: createMenu,
        UP_LEFT: UP_LEFT,
        UP_RIGHT: UP_RIGHT,
        DOWN_LEFT: DOWN_LEFT,
        DOWN_RIGHT: DOWN_RIGHT
    };
})