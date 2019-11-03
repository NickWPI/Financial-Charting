import Graph from "../Graph";
import {
    select as d3Select,
    timeFormat as d3TimeFormat
} from "d3";

let defaultLabelTexts = {
    date: "Date: ",
    open: " O: ",
    high: " H: ",
    low: " L: ",
    close: " C: "
}

class OHLCLabel extends Graph {
    constructor() {
        super();
        this.setProperties({
            origin: [0, 0],
            xDisplayFormat: d3TimeFormat("%Y-%m-%d"),
            labelTexts: defaultLabelTexts,
            accessor: d => {
                return {
                    date: d.date,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close,
                    volume: d.volume
                }
            },
        });
    }

    //add event handler for label events

    draw(surface, chartProps) {
        let overlaySVG = surface.getOverlaySVG();
        const {
            accessor,
            plotData: data
        } = this.properties;
        const {
            xDisplayFormat,
            displayFormat,
            origin,
            labelTexts
        } = this.properties;
        const { origin: chartOrigin } = chartProps;

        let realOrigin = [chartOrigin[0] + origin[0], chartOrigin[1] + origin[1]];
        let [x, y] = realOrigin;

        let date, open, high, low, close, volume;
        let currentItem = chartProps.currentItem;
        if(currentItem == undefined || accessor(currentItem) == undefined) {
            //use latest data as backup
            currentItem = data[data.length - 1];
        }
        if(currentItem != undefined && accessor(currentItem) != undefined) {
            let currentData = accessor(currentItem);
            //format these values
            date = xDisplayFormat(currentData.date);
            open = currentData.open;
            high = currentData.high;
            low = currentData.low;
            close = currentData.close;
            volume = currentData.volume;
        }

        let ohlcTarget = d3Select(overlaySVG).append("g");
        ohlcTarget.attr("class", "label-ohlc")
            .attr("id", "label-ohlc")
            .attr("transform", `translate(${x}, ${y})`);

        let labelText = ohlcTarget.append("text")
            .attr("text-anchor", "start")
            .attr("font-size", 15)
            .attr("dy", "0.35em");

        let spanLabel = labelText.append("tspan")
            .attr("class", "label-text");
        spanLabel.append("tspan")
            .attr("key", "date")
            .attr("fill", "#9400D3")
            .text(labelTexts.date);
        spanLabel.append("tspan")
            .attr("key", "value_date")
            .text(date);

        spanLabel.append("tspan")
            .attr("key", "open")
            .attr("fill", "#9400D3")
            .text(labelTexts.open);
        spanLabel.append("tspan")
            .attr("key", "value_open")
            .text(open);

        spanLabel.append("tspan")
            .attr("key", "high")
            .attr("fill", "#9400D3")
            .text(labelTexts.high);
        spanLabel.append("tspan")
            .attr("key", "value_high")
            .text(high);

        spanLabel.append("tspan")
            .attr("key", "low")
            .attr("fill", "#9400D3")
            .text(labelTexts.low);
        spanLabel.append("tspan")
            .attr("key", "value_low")
            .text(low);

        spanLabel.append("tspan")
            .attr("key", "close")
            .attr("fill", "#9400D3")
            .text(labelTexts.close);
        spanLabel.append("tspan")
            .attr("key", "value_close")
            .text(close);
    }
}

export default function () {
    return new OHLCLabel();
}