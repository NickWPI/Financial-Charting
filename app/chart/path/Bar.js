import functor from "./../utils/Functor";

export default function () {
    let context = null;

    let x = (d) => d.date;
    let y = (d) => d.close;
    let width = (d) => 3;
    let height = (d) => d.height;

    function bar(data) {
        data.map(function(d, i) {
            if(d != undefined && d != null) {
                let xLoc = x(d, i);
                let yLoc = y(d, i);
                let h = height(d, i);
                let w = width(d, i);
                let halfWidth = Math.floor(w / 2);
                context.rect(xLoc - halfWidth, yLoc, w, h);
            }
        });
        
        return context;
    }

    //set vertical and horizontal align (for things like MACD)

    bar.context = function(value) {
        if(value == undefined) {
            return context;
        }
        context = value;
        return bar;
    }

    bar.x = function (value) {
        if (value == undefined) {
            return x;
        }
        x = functor(value);
        return bar;
    }

    bar.y = function (value) {
        if (value == undefined) {
            return y;
        }
        y = functor(value);
        return bar;
    }

    bar.width = function(value) {
        if (value == undefined) {
            return width;
        }
        width = functor(value);
        return bar;
    }

    bar.height = function(value) {
        if (value == undefined) {
            return height;
        }
        height = functor(value);
        return bar;
    }

    return bar;
}