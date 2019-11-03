import indicatorBase from "./Indicator";
import rebind from ".././utils/Rebind";

export default function() {
    let settings = {
        period: 14,
        field: d => d.close
    };
    let base = indicatorBase()
        .type("rsi")
        .accessor(d => d["rsi" + settings.period])
        .combine((d, c) => d["rsi" + settings.period] = c);

    function rsi(data) {
        let period = settings.period;
        let field = settings.field;
        let prices = data.map(function(d) {
            return field(d);
        });
        let result = [];

        for(let i = 0; i < period - 1; i++) {
            result.push(undefined);
        }

        let averageGain = 0;
        let averageLoss = 0;
        let initialPrices = prices.slice(0, period);
        let sumGain = 0;
        let sumLoss = 0;
        for(let j = 1; j < initialPrices.length; j++) {
            let difference = initialPrices[j] - initialPrices[j - 1];
            if(difference >= 0) {
                sumGain += difference;
            }
            else
            {
                sumLoss -= difference;
            }
        }
        averageGain = sumGain / period;
        averageLoss = sumLoss / period;
        let initialRelativeStrength = averageGain / averageLoss;
        let initialRSI = 100.0 - (100.0 / (1 + initialRelativeStrength));
        result.push(initialRSI);
        for (let i = period; i < prices.length; i++) {
            let difference = prices[i] - prices[i - 1];
            if(difference >= 0) {
                averageGain = (averageGain * (period - 1) + difference) / period;
                averageLoss = (averageLoss * (period - 1)) / period;
            }
            else {
                averageGain = (averageGain * (period - 1)) / period;
                averageLoss = (averageLoss * (period - 1) - difference) / period;
            }
            let relativeStrength = averageGain / averageLoss;
            let rsi = 100.0 - (100.0 / (1 + relativeStrength));
            result.push(rsi);
        }
        return result;
    }

    rsi.undefinedLength = function() {
        const { period } = settings;
        return period - 1;
    }

    rsi.settings = function(value) {
        if(value == undefined) {
            return settings;
        }
        settings = Object.assign(settings, value);
        return rsi;
    }

    rebind(rsi, base, "setAccessorName", "accessor", "combine", "type");
    return rsi;
}