import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
    name: String,
    code: String,
    country: String
});

const currencyMaster= mongoose.model('currency', currencySchema);

export { currencyMaster};