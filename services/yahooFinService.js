import yahooFinance from 'yahoo-finance2';

async function quote(sec) {
    console.log(sec);
    var res = await yahooFinance.quote(sec);
    console.log(res);
    const data = res;
    return data;
}


async function quoteSummary(sec) {
    var result = await yahooFinance.quoteSummary(sec, { modules: 'all' });
    console.log(result);
    return result;
}

async function screener(sec) {
    const queryOptions = { scrIds: 'day_gainers', count: 5, region: 'US', lang: 'en-US' };
    const screener = await yahooFinance.screener(queryOptions);
    console.log(screener);
    return screener;
}



async function fundamentalsTimeSeries(sec) {
    var result = await yahooFinance.fundamentalsTimeSeries(sec, { period1: '2020-01-01', module: 'all', type: 'annual' });
    console.log(result);
    return result;
}


// async function fundamentalsTimeSeries(sec) {
//     var result = await yahooFinance.fundamentalsTimeSeries(sec, { period1: '2020-01-01', module: 'all', type: 'annual' });
//     console.log(result);
//     return result;
// }

async function historical(sec) {
    const query = 'TSLA';
    const queryOptions = { period1: '2020-01-01', interval: '1mo', events: 'history', includeAdjustedClose: true };
    const result1 = await yahooFinance.historical(query, queryOptions);
    console.log(result1);
}


async function search(sec) {
    const results = await yahooFinance.search(sec);

    return results;
}

async function chart(sec) {
    const queryOptions = { period1: '2021-05-08', useYfid: true, interval: '1d' };
    const results = await yahooFinance.chart(sec, queryOptions);
    console.log(results);
    return results;
}


export { quote, quoteSummary, search };