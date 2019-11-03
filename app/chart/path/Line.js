import functor from "./../utils/Functor";

export default function() {
    let context = null;

    let y = (d) => d.close;
    let x = (d) => d.date;

    function line(data) {
        data.map(function(d, i) {
            if(d != undefined && d != null) {
                const xPos = x(d, i);
                const yPos = y(d, i);
                
                if(i == 0) {
                    context.moveTo(xPos, yPos);
                }
                else {
                    context.lineTo(xPos, yPos);
                }
            }
        });

        return context;
    }

    line.context = function(value) {
        if(value == undefined) {
            return context;
        }
        context = value;
        return line;
    }

    line.x = function (value) {
        if (value == undefined) {
            return x;
        }
        x = functor(value);
        return line;
    }

    line.y = function (value) {
        if (value == undefined) {
            return y;
        }
        y = functor(value);
        return line;
    }
        
    return line;
}