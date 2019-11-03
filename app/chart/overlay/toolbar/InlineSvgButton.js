export default function() {
    let width = 10;
    let height = 10;
    let svg;

    function inlineSvgButton(selection) {
        let iconContainer = selection.append("g")
            .attr('width', width)
            .attr('height', height)
            .html(svg);
        return iconContainer;
    }

    inlineSvgButton.icon = function(value) {
        if(value == undefined) {
            return icon;
        }
        svg = value;
        return inlineSvgButton;
    }

    inlineSvgButton.width = function(value) {
        if(value == undefined) {
            return width;
        }
        width = value;
        return inlineSvgButton;
    }

    inlineSvgButton.height = function(value) {
        if(value == undefined) {
            return height;
        }
        height = value;
        return inlineSvgButton;
    }

    return inlineSvgButton;
}