import mongoose from 'mongoose';

const ATHTrackerSchema = new mongoose.Schema({
    symbol: { type: mongoose.Schema.Types.ObjectId, ref: 'SecurityMaster' },
    HighToday: Number,
    ATH: Number,
    ATHDate:Date
});

const ATHTracker = mongoose.model('Security', ATHTrackerSchema);

export default ATHTracker;