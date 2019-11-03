import functor from "./../utils/Functor";

export default function () {
    let context = null;
    let x = (d) => d.date;
    let open = (d) => d.open;
    let close = (d) => d.close;
    let bandwidth = () => 3;

    //pass in datum instead
    //using pixel values
    function candle(data) {
        //draw candle
        data.map(function (d, i) {
            if(d != undefined && d != null) {
                const xValue = x(d, i);
                const openValue = open(d, i);
                const closeValue = close(d, i);
                const candlestickWidth = bandwidth(d, i);

                let xLoc = xValue - candlestickWidth / 2;
                let yLoc = Math.min(openValue, closeValue);
                let w = candlestickWidth;
                let h = (openValue === closeValue) ? 1
                    : Math.max(openValue, closeValue) - Math.min(openValue, closeValue);
                context.rect(xLoc, yLoc, w, h);
            }
        });

        return context;
    }

    candle.context = function (value) {
        if (value == undefined) {
            return context;
        }
        context = value;
        return candle;
    }

    candle.x = function (value) {
        if (value == undefined) {
            return x;
        }
        x = functor(value);
        return candle;
    }

    candle.open = function (value) {
        if (value == undefined) {
            return open;
        }
        open = functor(value);
        return candle;
    }

    candle.close = function (value) {
        if (value == undefined) {
            return close;
        }
        close = functor(value);
        return candle;
    }

    candle.bandwidth = function (value) {
        if (value == undefined) {
            return bandwidth;
        }
        bandwidth = functor(value);
        return candle;
    }

    return candle;
}