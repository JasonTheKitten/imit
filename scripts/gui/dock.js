define([], function() {
    class Dock {
        constructor(element, initialLayout) {
            this.dockElement = element;
            this.layout = initialLayout;

            this.addDockDecorations();
            this.configureGridSizes(initialLayout);
            this.configureDropTarget();
        }

        addDockDecorations() {
            let dockDecorTemplate = document.getElementById("dock-decorations-template");

            let children = this.dockElement.children;
            for (let i = 0; i < children.length; i++) {
                if (!children[i].classList.contains("dock")) {
                    continue;
                }

                this.addDockDecoration(children[i], dockDecorTemplate);
            }
        }

        addDockDecoration(element, template) {
            let dockDecor = template.content.children[0].cloneNode(true);
            element.prepend(dockDecor);

            this.configureDockDecoration(element, dockDecor);
        }

        configureDockDecoration(element, dockDecor) {
            let dockId = element.getAttribute("dock-id");
            dockDecor.setAttribute("draggable", "true")

            dockDecor.addEventListener("dragstart", function(e) {
                //TODO: Hard remove or soft remove?
                this.layout = createLayoutMinusDock(this.layout, dockId);

                e.dataTransfer.dropEffect = "move";
            });

            dockDecor.addEventListener("drag", function(e) {
                element.style["display"] = "none";
            });

            dockDecor.addEventListener("dragend", function(e) {
                element.style["display"] = "flex";
            });
        }

        configureGridSizes(layout) {
            this.dockElement.style["grid-template-columns"] = this.buildPxArray(layout.columnWidths);
            this.dockElement.style["grid-template-rows"] = this.buildPxArray(layout.rowHeights);
        }

        buildPxArray(sizes) {
            let pxArray = "";
            for (let i = 0; i < sizes.length; i++) {
                if (sizes[i] == -1) {
                    pxArray += "auto ";
                } else {
                    pxArray += sizes[i] + "px ";
                }
            }

            return pxArray;
        }

        configureDropTarget() {
            this.dockElement.addEventListener("dragover", function(e) {
                e.preventDefault();
            });
            this.dockElement.addEventListener("drop", function(e) {
                e.preventDefault();
            });
        }
        
        createLayoutMinusDock(originalLayout, dockID) {
            let layout = copyLayout(originalLayout);
        }

        copyLayout(originalLayout) {
            let layout = {
                columnWidths: originalLayout.columnWidths,
                rowHeights: originalLayout.rowHeights,
                grid: {},
                floating: [
                    // {id, x, y}
                ]
            }
        }
    }

    return {
        Dock: Dock
    }
})