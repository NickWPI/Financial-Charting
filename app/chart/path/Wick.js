import functor from "./../utils/Functor";

export default function() {
    let context = null;
    let x = (d) => d.date;
    let high = (d) => d.high;
    let low = (d) => d.low;

    function wick(data) {
        //draw wick
        data.map(function(d, i) {
            if(d != undefined && d != null) {
                const xValue = x(d, i);
                const highValue = high(d, i);
                const lowValue = low(d, i);

                let x1 = xValue;
                let x2 = xValue;
                let y1 = highValue;
                let y2 = lowValue;
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
            }
        });

        return context;
    }

    wick.context = function(value) {
        if(value == undefined) {
            return context;
        }
        context = value;
        return wick;
    }

    wick.x = function (value) {
        if (value == undefined) {
            return x;
        }
        x = functor(value);
        return wick;
    }

    wick.high = function (value) {
        if (value == undefined) {
            return high;
        }
        high = functor(value);
        return wick;
    }

    wick.low = function (value) {
        if (value == undefined) {
            return low;
        }
        low = functor(value);
        return wick;
    }

    return wick;
}