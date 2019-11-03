export default function() {
    let width = 12;
    let height = 10;
    let fill = "black";
    let stroke = "black";

    function rectangle(selection) {
        let rect = selection.append("rect")
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr("fill", fill)
            .attr("stroke", stroke);
        return rect;
    }

    rectangle.width = function(value) {
        if(value == undefined) {
            return width;
        }
        width = value;
        return rectangle;
    }

    rectangle.height = function(value) {
        if(value == undefined) {
            return height;
        }
        height = value;
        return rectangle;
    }

    rectangle.fill = function(value) {
        if(value == undefined) {
            return height;
        }
        fill = value;
        return rectangle;
    }

    rectangle.stroke = function(value) {
        if(value == undefined) {
            return height;
        }
        stroke = value;
        return rectangle;
    }

    return rectangle;
}