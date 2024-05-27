import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
    name: String,
    value: String,
    Country: String
});

const currency = mongoose.model('Security', currencySchema);

export default currency;