import mongoose from 'mongoose';

const securityMasterSchema = new mongoose.Schema({
    exchange: String,
    shortname: String,
    quoteType: String,
    symbol: String,
    index: String,
    score: Number,
    typeDisp: String,
    longname: String,
    exchDisp: String,
    sector: String,
    sectorDisp: String,
    industry: String,
    industryDisp: String,
    isYahooFinance: Boolean
});

const securityMaster = mongoose.model('SecurityMaster', securityMasterSchema);

export default securityMaster;