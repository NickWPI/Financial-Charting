export var dataSource = {};
async function fetchJSONData(url) {
    let priceList = [];
    try {
        const resp = await fetch(url);
        let jsonObj = await resp.json();
        let jsonData = jsonObj["Data"];
        let prevData = -1;
        for (let i = 0; i < jsonData.length; i++) {
            let dataObj = jsonData[i];
            let price = dataObj["close"];
            var data = {
                price: price,
                open: dataObj["open"],
                close: price,
                high: dataObj["high"],
                low: dataObj["low"],
                time: dataObj["time"], //temporary for now
                date: dataObj["time"],
                volume: dataObj["volumefrom"],
                isPositiveChange: (price >= prevData ? true : false)
            };
            prevData = data.price;
            priceList.push(data);
        }
        priceList.forEach(function (d) { 
            d.time = new Date(d.time * 1000); 
            d.date = d.time;
        });
        //priceList.forEach(function (d) { d.time = d.time * 1000; });
        if(priceList.length == 0) {
            console.log(jsonObj);
        }
        return priceList;
    }
    catch (error) {
        console.log(error);
    }
}

/*
    let priceList = await fetchJSONData(url);
    return priceList.slice(priceList.length - 1 - limit, priceList.length - 1); */
dataSource.getHistoricalMinuteCryptoPrice = async function(values) {
    let url = "https://min-api.cryptocompare.com/data/histominute?fsym=" + values.fromCurrency
        + "&tsym=" + values.market + "&limit=" + values.limit + ((values.toTimestamp != null && values.toTimestamp != undefined) ? ("&toTs=" + values.toTimestamp) : "");
    return fetchJSONData(url);
}

dataSource.getHistoricalHourlyCryptoPrice = async function(values) {
    let url = "https://min-api.cryptocompare.com/data/histohour?fsym=" + values.fromCurrency
        + "&tsym=" + values.market + "&limit=" + values.limit + ((values.toTimestamp != null && values.toTimestamp != undefined) ? ("&toTs=" + values.toTimestamp) : "");
    return fetchJSONData(url);
}

dataSource.getHistoricalDailyCryptoPrice = async function(values) {
    let url = "https://min-api.cryptocompare.com/data/histoday?fsym=" + values.fromCurrency
        + "&tsym=" + values.market + "&limit=" + values.limit + ((values.toTimestamp != null && values.toTimestamp != undefined) ? ("&toTs=" + values.toTimestamp) : "");
    return fetchJSONData(url);
}

dataSource.getHistoricalCryptoPrice = async function(type, values) {
    if (type == "minute") {
        return dataSource.getHistoricalMinuteCryptoPrice(values);
    }
    else if (type == "hour") {
        return dataSource.getHistoricalHourlyCryptoPrice(values);
    }
    else if (type == "day") {
        return dataSource.getHistoricalDailyCryptoPrice(values);
    }
}

dataSource.getHistoricalCryptoPriceNoLimit = async function(type, values) {
    if(values.limit < 0)
        return [];
    try {
        let priceList = [];
        if (type == "minute") {
            priceList = await dataSource.getHistoricalMinuteCryptoPrice({fromCurrency: values.fromCurrency, market: values.market, 
                toTimestamp: values.toTimestamp, limit: values.limit > 2000 ? 2000 : values.limit});
        }
        else if (type == "hour") {
            priceList = await dataSource.getHistoricalHourlyCryptoPrice({fromCurrency: values.fromCurrency, market: values.market, 
                toTimestamp: values.toTimestamp, limit: values.limit > 2000 ? 2000 : values.limit});
        }
        else if (type == "day") {
            priceList = await dataSource.getHistoricalDailyCryptoPrice({fromCurrency: values.fromCurrency, market: values.market, 
                toTimestamp: values.toTimestamp, limit: values.limit > 2000 ? 2000 : values.limit});
        }
        let priceList2 = await dataSource.getHistoricalCryptoPriceNoLimit(type, {fromCurrency: values.fromCurrency, market: values.market, 
            toTimestamp: priceList[0].time.getTime() / 1000, limit: values.limit - 2000});
        let totalPriceList = priceList2.concat(priceList);
        return totalPriceList;
    }
    catch(error) {
        console.log(error);
    }
}