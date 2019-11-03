import merger from "./Merge"
//all data is of the type from merge
export default function () {
    let indicators = [];
    let skipUndefined = true;

    //ema(sma(rsi(data)))
    function pack(data) {
        let combinedData = data;
        for (let i = 0; i < indicators.length; i++) {
            let { merge, calculator } = indicators[i];
            let indicatorData = calculator(data);
            //console.log(indicatorData);
            merge.combine(calculator.combine()).datum(indicatorData);
            combinedData = merge(combinedData);
        }

        return combinedData;
    }

    pack.add = function (indicator, name) {
        let merge = merger();
            //.combine(indicator.combine());
        indicators.push({
            merge: merge,
            calculator: indicator,
            name: name
        });

        return pack;
    }

    pack.get = function (name) {
        for(let i = 0; i < indicators.length; i++) {
            if(indicators[i].name === name) {
                return indicators[i].calculator;
            }
        }
    }

    pack.exists = function (name) {
        for(let i = 0; i < indicators.length; i++) {
            if(indicators[i].name === name) {
                return true;
            }
        }
        return false;
    }

    pack.remove = function (name) {
        indicators = indicators.filter(d => d.name !== name);
        return pack;
    }

    pack.undefinedLength = function() {
        let maxLength = 0;
        for(let i = 0; i < indicators.length; i++) {
            let { calculator } = indicators[i];
            maxLength = Math.max(maxLength, calculator.undefinedLength());
        }
        return maxLength + 1;
    }

    pack.skipUndefined = function (value) {

    }

    return pack;
}

//packer().data(values).add(ema).add(sma).alignAccessor(d => d.time).pack();