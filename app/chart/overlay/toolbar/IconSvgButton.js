export default function() {
    let width = 10;
    let height = 10;
    let icon;
    let onClick;

    function iconSvgButton(selection) {
        let iconContainer = selection.append("svg:image")
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr("xlink:href", icon)
            .on("click", onClick);
        return iconContainer;
    }

    iconSvgButton.onClick = function(value) {
        if(value == undefined) {
            return onClick;
        }
        onClick = value;
        return iconSvgButton;
    }

    iconSvgButton.icon = function(value) {
        if(value == undefined) {
            return icon;
        }
        icon = value;
        return iconSvgButton;
    }

    iconSvgButton.width = function(value) {
        if(value == undefined) {
            return width;
        }
        width = value;
        return iconSvgButton;
    }

    iconSvgButton.height = function(value) {
        if(value == undefined) {
            return height;
        }
        height = value;
        return iconSvgButton;
    }

    return iconSvgButton;
}