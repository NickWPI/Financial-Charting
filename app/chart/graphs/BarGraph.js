import barPath from ".././path/Bar";
import Graph from "../Graph";

//rename to VolumeGraph
class BarGraph extends Graph {
    constructor() {
        super();
        this.properties.volumeColorNeutral = "rgba(0, 200, 83, 0.3)";
        this.properties.volumeColorUp = "rgba(0, 200, 83, 0.3)";
        this.properties.volumeColorDown = "rgba(216, 27, 96, 0.3)";

        this.properties.volumeBarWidthRatio = 0.8;
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

        let {
            volumeBarWidthRatio,
            volumeColorUp,
            volumeColorDown,
            volumeColorNeutral
        }  = this.properties;

        let volumeBarWidth = volumeBarWidthRatio * (Math.abs(xScale(xAccessor(data[0])) - xScale(xAccessor(data[data.length - 1]))) / data.length);
        data.map(function(d, i) {
            if(d != undefined && d != null) {
                context.beginPath();
                let accessor = yAccessor(d);
                let open = accessor.open;
                let close = accessor.close;
                let volume = accessor.volume;

                let bar = barPath()
                    .x(d => xScale(xAccessor(d)))
                    .y(d => yScale(volume))
                    .width(d => volumeBarWidth)
                    //yScale.range()[0] - 
                    .height(d => yScale.range()[0] - yScale(volume))
                    .context(context);
                context.fillStyle = (open === close) ? volumeColorNeutral : (open > close) ? volumeColorDown : volumeColorUp;
                bar([d]);
                context.fill();
            }
        });

        return this;
    }
}

export default function() {
    return new BarGraph();
}