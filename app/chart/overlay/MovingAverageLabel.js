import singleValueLabel from "./SingleValueTextLabel";
import {
    select as d3Select,
    format as d3Format
} from "d3";
import Graph from "../Graph";

class MovingAverageLabel extends Graph {
    constructor() {
        super();
        this.setProperties({
            labelType: singleValueLabel(),
            field: "N/A",
            type: "N/A",
            period: "N/A",
            //accessor
            origin: [0, 0],
            displayFormat: d3Format(".2f"),
            labelFill: "#9400D3",
            valueFill: "#000000",
            fontFamily: "Times New Roman, serif",
            fontSize: 15,
            labelText: "",
            valueText: "",
            toolbarItemSpacing: 3,
            toolbar: []
        });
    }

    draw(surface, chartProps) {
        let svgTarget = surface.getOverlaySVG();

        let { plotData: data, accessor } = this.properties;
        let { origin, type, period, field, displayFormat, labelType, labelFill, valueFill, fontFamily, fontSize, toolbarItemSpacing, toolbar } = this.properties;
        const { origin: chartOrigin } = chartProps;

        let labelText = `MA(${period}, ${type}, ${field})`;

        let realOrigin = [chartOrigin[0] + origin[0], chartOrigin[1] + origin[1]];
        let [x, y] = realOrigin;

        let valueText;
        let currentItem = chartProps.currentItem;
        if(currentItem == undefined || accessor(currentItem) == undefined) {
            //use latest data as backup
            currentItem = data[data.length - 1];
        }
        if(currentItem != undefined && accessor(currentItem) != undefined) {
            let currentData = accessor(currentItem);
            //format these values
            valueText = displayFormat(currentData);
        }
        if(valueText == undefined) {
            valueText = "N/A";
        }

        let labelGroup = d3Select(svgTarget).append("g")
            .attr("transform", `translate(${x}, ${y})`);

        //calculate positioning of buttons
        let currentWidth = 0;
        toolbar.map(function(item, index) {
            let container = item(labelGroup);
            let spacing = toolbarItemSpacing * (index == 0 ? index : 1);
            container.attr("x", spacing + currentWidth)
                .attr("y", -item.height() / 2);
            currentWidth += item.width() + spacing;
        });

        let xTextPosition = currentWidth + (currentWidth == 0 ? 0 : toolbarItemSpacing);
        let yTextPosition = fontSize / 2;
        let simpleLabelText = labelGroup.append("text")
            .attr("text-anchor", "start")
            .attr("transform", `translate(${xTextPosition}, 0)`)
            .attr("dy","0.35em")

        labelType.valueText(valueText);
        labelType.labelText(labelText);
        labelType.labelFill(labelFill);
        labelType.valueFill(valueFill);
        simpleLabelText.call(labelType);
    }
}

export default function() {
    return new MovingAverageLabel();
}