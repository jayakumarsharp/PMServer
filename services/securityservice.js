
import {securityMaster} from '../model/SecurityMaster';

async function securities() {
    const docs = await securityMaster.find();
    return docs;
}

async function updateSecurity(newData) {
    try {
        const existingSecurity = await securityMaster.findOne({ symbol: newData.symbol });

        if (existingSecurity) {
            const updatedSecurity = await securityMaster.findByIdAndUpdate(existingSecurity._id, newData, { new: true });
            if (!updatedSecurity) throw new Error('Security not found after update attempt');
            return updatedSecurity;
        } else {
            console.log(newData);
            const newSecurity = new securityMaster(newData);
            await newSecurity.save();
            return newSecurity;
        }
    } catch (error) {
        throw error;
    }
}

// Search local SecurityMaster by symbol or name (case-insensitive, partial match)
async function searchLocal(term) {
    if (!term) return [];
    const regex = new RegExp(term, 'i');
    const results = await securityMaster.find({
        $or: [
            { symbol: regex },
            { shortname: regex },
            { longname: regex },
        ]
    }).limit(10).lean();

    return results.map(s => ({
        symbol: s.symbol,
        shortname: s.shortname || s.symbol,
        longname: s.longname || s.shortname || s.symbol,
        exchange: s.exchDisp || s.exchange,
        quoteType: s.quoteType || 'EQUITY',
        sector: s.sector,
        source: 'local',
    }));
}

async function deleteSecurityById(id) {
    try {
        const deleted = await securityMaster.findByIdAndDelete(id);
        if (!deleted) throw new Error(`Security not found: ${id}`);
        return deleted;
    } catch (err) {
        throw err;
    }
}

export { securities, updateSecurity, deleteSecurityById, searchLocal };
