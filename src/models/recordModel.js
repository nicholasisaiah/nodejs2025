const mongoose = require('mongoose');

const timeRecordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String, 
        enum: ["stopwatch", "countdown"],
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: false
    },
    label: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const TimeRecord = mongoose.model("TimeRecord", timeRecordSchema);

module.exports = TimeRecord;