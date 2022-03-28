define(["gui/dock"], function(dock) {
    function configureDocking() {
        let layout = {
            columnWidths: [256, -1],
            rowHeights: [-1],
            grid: [
                [0, 1]
            ],
            floating: {}
        }

        let contentPane = document.getElementById("content-area");
        new dock.Dock(contentPane, layout);
    }

    function setup() {
        configureDocking()
    }

    return { setup: setup };
})