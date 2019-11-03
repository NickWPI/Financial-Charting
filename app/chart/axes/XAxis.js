import Graph from "../Graph";
import {
    axisBottom as d3AxisBottom,
    select as d3Select,
    timeFormat as d3TimeFormat
} from "d3";

class YAxis extends Graph {
    constructor() {
        super();
        this.setProperties({
            axis: d3AxisBottom(),
            orient: "bottom",
            facing: "bottom",
            showTicks: true,
            tickStroke: "black",
            tickTrokeOpacity: 1,
            //tickSizeInner: 0,
            //tickSizeOuter: 0,
        });

        this.node = undefined;
    }

    draw(surface) {
        let svgTarget = surface.getAxesSVG();

        const {
            xScale,
            yScale
        } = this.properties;
        const { axis } = this.properties;
       // axis.tickFormat(d3TimeFormat("%B %d, %Y"));
        axis.ticks(3);

        let height = yScale.range()[0] - yScale.range()[1];
        let yPosition = height + yScale.range()[1];

        axis.scale(xScale);

        const {
            ticks,
            tickSize,
            tickFormat,
            tickSizeOuter
        } = this.properties;

        if (ticks != undefined) {
            if (typeof tickSize == "function") {
                let newTicks = ticks(this.properties);
                axis.ticks(newTicks);
            }
            else {
                axis.ticks(ticks);
            }
        }
        if (tickSize != undefined) {
            if (typeof tickSize == "function") {
                let newTickSize = tickSize(this.properties);
                axis.tickSize(newTickSize);
            }
            else {
                axis.tickSize(tickSize);
            }
        }
        if (tickFormat != undefined) {
            axis.tickFormat(tickFormat);
        }
        if (tickSizeOuter != undefined) {
            axis.tickSizeOuter(tickSizeOuter);
        }

        //use d3.force to detect collisions between axis labels

        const {
            tickStroke,
            tickTrokeOpacity
        } = this.properties;

        /*let axisTarget;
        if (this.node == undefined) {
            axisTarget = d3Select(svgTarget).append("g");
            this.node = axisTarget.node();
        }
        else {
            axisTarget = d3Select(this.node);
        }*/

        let axisTarget = d3Select(svgTarget).append("g");

        axisTarget.attr("class", "yAxis axis gridlines")
            .attr("transform", "translate(0, " + yPosition + ")")

        axisTarget.call(axis);

        axisTarget.selectAll(".tick line")
            .attr("stroke", `${tickStroke}`)
            //.attr("fill", "none")
            .attr("stroke-opacity", `${tickTrokeOpacity}`);
    }
}

export default function() {
    return new YAxis();
}