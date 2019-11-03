import Graph from "../Graph";
import {
    select as d3Select,
    timeFormat as d3TimeFormat
} from "d3";
import singleValueLabel from "./SingleValueTextLabel";

class SimpleLabel extends Graph {
    constructor() {
        super();
        this.setProperties({
            origin: [0, 0],
            labelType: singleValueLabel(),
            labelFill: "#9400D3",
            valueFill: "#000000",
            fontFamily: "Times New Roman, serif",
            fontSize: 15,
            labelText: "",
            valueText: ""
        })
    }

    draw(surface, chartProps) {
        let svgTarget = surface.getOverlaySVG();

        const { customUI, 
            labelType, 
            origin, 
            labelText, 
            valueText, 
            labelFill, 
            valueFill, 
            fontSize, 
            fontFamily 
        } = this.properties;
        const { origin: chartOrigin } = chartProps;

        let realOrigin = [chartOrigin[0] + origin[0], chartOrigin[1] + origin[1]];
        let [x, y] = realOrigin;

        let labelGroup = d3Select(svgTarget).append("g")
            .attr("transform", `translate(${x}, ${y})`);
        let simpleLabelText = labelGroup.append("text")
            .attr("text-anchor", "start")
            .attr("dy", "0.35em");
        /*labelGroup.append("rect")
            .attr("x", 10)
            .attr("y", 10)
            .attr("width", 50)
            .attr("height", 100);*/
        labelType.valueText(valueText);
        labelType.labelText(labelText);
        simpleLabelText.call(labelType);
    }
}

export default function() {
    return new SimpleLabel();
}