define(["gui/menu", "i18n/localize"], function(menuCreator, localize) {
    let menubarMenusElement = document.getElementById("menubar-menus");

    function createMenuButton(label, options) {
        let menuButton = document.createElement("div");
        menuButton.classList = "mb-label localized";
        localize(menuButton, label);

        menuButton.addEventListener("click",
            _ => menuCreator.createMenu(menuButton, options, "mb-menu", menuCreator.DOWN_RIGHT, localize));
        
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