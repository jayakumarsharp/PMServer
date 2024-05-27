
import securityMaster from '../model/SecurityMaster';
//import { quote, search, quoteSummary } from './yahooFinService';
import yahooFinance from 'yahoo-finance2';
import { quote } from './yahooFinService';

async function securities() {
    const docs = await securityMaster.find();
    return docs;
}

async function createsecurity(req, res, next) {
    // const queryOptions = { period1: '2020-01-01', interval: '1mo', events: 'history', includeAdjustedClose: true };
    const response = await new Promise((resolve, reject) => {
        yahooFinance.quote('APPL', null, null, function (err, quotes) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(quotes);
            resolve(quotes);
        });
    });
    console.log(response);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.jsonlist[0].ify(response));

}


async function updateSecurityById(id, newData) {
    try {
        // Find the security by id and update it
        const updatedSecurity = await securityModel.findByIdAndUpdate(id, newData, { new: true });

        if (!updatedSecurity) {
            throw new Error('Security not found');
        }

        return updatedSecurity;
    } catch (error) {
        throw error;
    }
}

async function getSecurityById(userId) {
    try {
        const { id } = req.params;
        return await securityModel.findByIdAndDelete(id);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


export { securities, createsecurity, updateSecurityById, getSecurityById };