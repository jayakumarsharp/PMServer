import mongoose from 'mongoose';

const trancodeSchema = new mongoose.Schema({
    trantype: String,
    desc: String,
});

const trancodeMaster = mongoose.model('trancode', trancodeSchema);

export { trancodeMaster };