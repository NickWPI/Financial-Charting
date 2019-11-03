import merger from "./Merge"
//all data is of the type from merge
export default function() {
    let dataToPack = [];
    let data = [];

    //ema(sma(rsi(data)))
    function pack() {
        let combinedData = data;
        for(let i = 0; i < dataToPack.length; i++) {
            let datumToMerge = dataToPack[i];
            combinedData = datumToMerge(combinedData);
        }
        return combinedData;
    }

    pack.datum = function(value) {
        if (value == undefined) {
            return data;
        }
        data = value;
        return pack;
    }

    pack.add = function(value, combine) {
        if(!Array.isArray(value)) {
            dataToPack.push(value);
        }
        else {
            //create merge object
            let merge = merger()
                .datum(value);
            if(combine != undefined)
                merge.combine(combine);
            dataToPack.push(merge);
        }
        return pack;
    }

    return pack;
}

//packer().data(values).add(ema).add(sma).alignAccessor(d => d.time).pack();