import indicatorBase from "./Indicator";
import rebind from ".././utils/Rebind";

export default function() {
    let settings = {
        period: 50,
        field: d => d.close
    };
    let base = indicatorBase()
        .type("sma")
        //.name("sma" + settings.period)
        .accessor(d => d["sma" + settings.period])
        .combine((d, c) => d["sma" + settings.period] = c);

    function sma(data) {
        let period = settings.period;
        let field = settings.field;
        let prices = data
        let result = [];
        for (let i = 0; i < prices.length; i++) {
            if (i < period - 1) {
                result.push(undefined);
                continue;
            }
            /*if (i + period > prices.length) {
                result.push(undefined);
                break;
            }*/
            let temp = prices.slice(i - period, i);
            let sum = 0;
            let undefinedLength = 0;
            for (let j = 0; j < temp.length; j++) {
                let value = field(temp[j]);
                if(value != undefined && value != null) {
                    sum += value;
                }
                else {
                    undefinedLength++;
                }
            }
            let average = sum / (temp.length - undefinedLength);
            result.push(average);
        }
        //console.log(result);
        return result;
    }

    sma.undefinedLength = function() {
        const { period } = settings;
        return period - 1;
    }

    sma.settings = function(value) {
        if(value == undefined) {
            return settings;
        }
        settings = Object.assign(settings, value);
        return sma;
    }

    rebind(sma, base, "setAccessorName", "accessor", "combine", "type");
    return sma;
}

//packer.datum(data).add(sma).add(ema)