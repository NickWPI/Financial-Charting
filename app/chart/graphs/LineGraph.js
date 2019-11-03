import Graph from "../Graph";
import linePath from "./../path/Line";

class LineGraph extends Graph {
    constructor() {
        super();
        //set default props outside the function
        this.properties.color = "green";
        this.properties.width = 2;
    }

    draw(surface) {
        let context = surface.getDrawContext();
        
        let xAccessor = this.properties.xAccessor;
        let yAccessor = this.properties.yAccessor;
        let xScale = this.properties.xScale;
        let yScale = this.properties.yScale;
        let data = this.properties.plotData;

        if(data.length == 0) {
            return;
        }

        //const { xAccessor, yAccessor, xScale, yScale, data } = this.properties;
        let line = linePath()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(yAccessor(d)))
            .context(context);
        context.beginPath();
        line(data);
        context.lineWidth = this.properties.width;
        context.strokeStyle = this.properties.color;
        context.stroke();
        return this;
    }
}

export default function() {
    return new LineGraph();
}