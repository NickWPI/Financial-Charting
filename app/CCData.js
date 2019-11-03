export default function () {
    let coinListUrl = "https://min-api.cryptocompare.com/data/all/coinlist";
    let pairListUrl = "https://min-api.cryptocompare.com/data/cccagg/pairs";

    let pairList = {};
    let cryptocurrencyList = [];
    async function fetchData() {
        try {
            const response = await fetch(coinListUrl);
            let jsonObj = await response.json();
            let jsonData = jsonObj["Data"];
            for (let keys in jsonData) {
                let dataObj = jsonData[keys];
                let coinName = dataObj["CoinName"];
                let fullName = dataObj["FullName"];
                let symbol = dataObj["Symbol"];
                let cryptocurrency = {
                    coinName: coinName,
                    fullName: fullName,
                    symbol: symbol
                };
                //console.log(cryptocurrency);
                cryptocurrencyList.push(cryptocurrency);
            }

            const response2 = await fetch(pairListUrl);
            let jsonObj2 = await response2.json();
            let jsonData2 = jsonObj2["Data"];
            const entries = Object.entries(jsonData2);
            for (let [key, values] of entries) {
                let markets = [];
                for (let market in values) {
                    markets.push(market);
                }
                pairList[key] = markets;
            }
        } catch (error) {
            console.log(error);
        }
        //console.log(cryptocurrencyList);
        //console.log(pairList);
        return { ccList: cryptocurrencyList, ccPairs: pairList };
    }

    return fetchData;
}
