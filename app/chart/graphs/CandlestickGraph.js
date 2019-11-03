import candlePath from ".././path/Candle";
import wickPath from ".././path/Wick";
import Graph from "../Graph";

class CandlestickGraph extends Graph {
    constructor() {
        super();
        this.properties.wickColorNeutral = "white";
        this.properties.wickColorUp = "green";
        this.properties.wickColorDown = "red";
    
        this.properties.candleColorNeutral = "silver";
        this.properties.candleColorUp = "rgba(216, 27, 96, 1.0)";
        this.properties.candleColorDown = "rgba(20, 175, 83, 1.0)";
    
        this.properties.candlestickWidthRatio = 0.7;
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
            wickColorNeutral,
            wickColorDown,
            wickColorUp,
            candlestickWidthRatio, 
            candleColorNeutral, 
            candleColorUp, 
            candleColorDown } = this.properties;

        //draw wick
        data.map(function(d, i) {
            if(d != undefined && d != null) {
                let accessor = yAccessor(d);
                let open = accessor.open;
                let high = accessor.high;
                let low = accessor.low;
                let close = accessor.close;

                context.beginPath();
                let wick = wickPath()
                    .x(d => xScale(xAccessor(d)))
                    .high((d) => yScale(high))
                    .low((d) => yScale(low))
                    .context(context);
                context.lineWidth = 1;
                context.strokeStyle = (open === close) ? wickColorNeutral : (open > close) ? wickColorDown : wickColorUp;
                wick([d]);
                context.stroke();
            }
        });

        context.strokeStyle = "grey";
        context.strokeWidth = 1;

        let candlestickWidth = candlestickWidthRatio * (Math.abs(xScale(xAccessor(data[0])) - xScale(xAccessor(data[data.length - 1]))) / data.length);
        //draw candle
        data.map(function(d, i) {
            let accessor = yAccessor(d);
            let open = accessor.open;
            let close = accessor.close;

            context.beginPath();
            let candle = candlePath()
                .x(d => xScale(xAccessor(d)))
                .open((d) => yScale(open))
                .close((d) => yScale(close))
                .bandwidth((d) => candlestickWidth)
                .context(context);
            context.fillStyle = (open === close) ? candleColorNeutral
                : ((open > close) ? candleColorUp : candleColorDown);
            candle([d]);
            context.fill();
            context.stroke();
        });

        return this;
    }
}

export default function() {
    return new CandlestickGraph();
}