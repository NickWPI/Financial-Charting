import Graph from "../Graph";
import linePath from "./../path/Line";

class RSIGraph extends Graph {
    constructor() {
        super();
        //set default props outside the function
        this.setProperties({
            color: "green",
            width: 2,
            overboughtThreshold: 80,
            oversoldThreshold: 20,
            overboughtLineColor: "rgba(255, 0, 0, 0.2)",
            oversoldLineColor: "rgba(0, 255, 0, 0.2)",
            overboughtLineWidth: 2,
            oversoldLineWidth: 2
        })
    }

    draw(surface) {
        let context = surface.getDrawContext();

        let xAccessor = this.properties.xAccessor;
        let yAccessor = this.properties.yAccessor;
        let xScale = this.properties.xScale;
        let yScale = this.properties.yScale;
        let data = this.properties.plotData;

        const { overboughtThreshold, oversoldThreshold, overboughtLineColor, oversoldLineColor, overboughtLineWidth, oversoldLineWidth } = this.properties;

        if (data.length == 0) {
            return;
        }

        //render overbought and oversold lines
        let overboughtLine = linePath()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(overboughtThreshold))
            .context(context);
        context.beginPath();
        overboughtLine(data);
        context.lineWidth = overboughtLineWidth;
        context.strokeStyle = overboughtLineColor;
        context.stroke();

        //oversold line
        let oversoldLine = linePath()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(oversoldThreshold))
            .context(context);
        context.beginPath();
        oversoldLine(data);
        context.lineWidth = oversoldLineWidth;
        context.strokeStyle = oversoldLineColor;
        context.stroke();

        //const { xAccessor, yAccessor, xScale, yScale, data } = this.properties;
        let rsi = linePath()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(yAccessor(d)))
            .context(context);
        context.beginPath();
        rsi(data);
        context.lineWidth = this.properties.width;
        context.strokeStyle = this.properties.color;
        context.stroke();
        return this;
    }
}

export default function () {
    return new RSIGraph();
}