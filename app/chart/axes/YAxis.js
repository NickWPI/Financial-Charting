import Graph from "../Graph";
import {
    axisRight as d3AxisRight,
    axisLeft as d3AxisLeft,
    select as d3Select,
    selectAll as d3SelectAll
} from "d3";

class YAxis extends Graph {
    constructor() {
        super();
        this.setProperties({
            axis: d3AxisRight(),
            orient: "right",
            facing: "right",
            showTicks: true,
            tickStroke: "black",
            tickTrokeOpacity: 1,
            //tickSizeInner: 0,
            //tickSizeOuter: 0,
        });

        /*
        tickLabelFill: PropTypes.string,
        tickStroke: PropTypes.string,
        tickStrokeOpacity: PropTypes.number,
        tickStrokeWidth: PropTypes.number,
        tickStrokeDasharray: PropTypes.oneOf(strokeDashTypes)
        */

        this.node = undefined;
    }

    draw(surface) {
        let svgTarget = surface.getAxesSVG();

        const {
            xScale,
            yScale
        } = this.properties;
        const { axis } = this.properties;

        let width = xScale.range()[1] - xScale.range()[0];
        let xPosition = width + xScale.range()[0];

        axis.scale(yScale);

        const {
            ticks,
            tickSize,
            tickValues,
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
        if (tickValues != undefined) {
            if (typeof tickSize == "function") {
                let newTickValues = tickValues(this.properties);
                axis.tickValues(newTickValues);
            }
            else {
                axis.tickValues(tickValues);
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
            .attr("transform", "translate(" + xPosition + ", 0)")

        axisTarget.call(axis);

        axisTarget.selectAll(".tick line")
            .attr("stroke", `${tickStroke}`)
            .attr("stroke-opacity", `${tickTrokeOpacity}`);
    }
}

export default function () {
    return new YAxis();
}