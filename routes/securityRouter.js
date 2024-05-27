import express from 'express';
import yahooFinance from 'yahoo-finance2';
import { securities, createsecurity, updateSecurityById, getSecurityById } from '../services/securityservice';

const securityapiRouter = express.Router();

securityapiRouter.get('/securities', async (req, res) => {
    try {
        const security = await securities();
        res.json(security);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

securityapiRouter.post('/getchart', async (req, res) => {
    try {
        console.log(req.body.name);
        const queryOptions = {
            period1: '2023-04-08', useYfid: true, interval: '1d',
            includePrePost: true, events: 'div', lang: 'en-US'
        };
        const results = await yahooFinance.chart(req.body.name, queryOptions);
        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


securityapiRouter.post('/search', async (req, res) => {
    try {
        const search = await yahooFinance.search(req.body.name);
        res.json(search);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

securityapiRouter.post('/historical', async (req, res) => {
    try {
        const query = req.body.name;
        const queryOptions = { period1: '2000-01-01', interval: '1d', events: 'history', includeAdjustedClose: true };
        const result1 = await yahooFinance.historical(query, queryOptions);
        console.log('data arrived');

        const stockPrices = result1;
        let obj = [];
        let allTimeHigh = 0;
        let daysToBreakHigh = [];
        let lastHighDate = '';
        let lastDate = '';
        let dayCount = 0;
        // Iterate through the stock prices
        for (const entry of stockPrices) {
            const date = entry.date;
            const price = parseFloat(entry.close);
            dayCount++;
            if (price > allTimeHigh) {
                if (allTimeHigh > 0) {
                    daysToBreakHigh.push(dayCount);
                    //console.log(`New all-time high on ${date}, Previous high on ${lastDate}, Days to break: ${dayCount}`);
                }
                obj.push({
                    allTimeHigh: allTimeHigh,
                    lastHighDate: date,
                    lastDate: lastDate,
                    dayCount: dayCount
                });
                allTimeHigh = price;
                lastHighDate = lastDate;
                lastDate = date;
                dayCount = 0;
            }
        }
        // Output results
        console.log('Processing complete.');

        result1.manipulated = obj;
        result1.allTimeHighcount = daysToBreakHigh;
        // console.log(obj);
        // console.log(daysToBreakHigh);
        res.json(obj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


securityapiRouter.post('/quoteSummary', async (req, res) => {
    try {
        const search = await yahooFinance.quoteSummary(req.body.name);
        res.json(search);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


securityapiRouter.post('/fundamentalsTimeSeries', async (req, res) => {
    try {
        const search = await yahooFinance.fundamentalsTimeSeries(req.body.name, { period1: '2020-01-01', module: 'all', type: 'annual' });
        res.json(search);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

securityapiRouter.post('/Addsecurity', async (req, res) => {
    try {
        const search = await yahooFinance.search(req.body.name);
        res.json(search);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

securityapiRouter.put('/security/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedsecurity = updateSecurityById(id, req.body, { new: true });
        res.json(updatedsecurity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

securityapiRouter.delete('/security/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await getSecurityById(id);
        res.json({ msg: 'security deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default securityapiRouter;