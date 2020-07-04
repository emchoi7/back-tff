const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        min: 1,
        max: 9,
        required: [true, 'Please add a hunger score between 1 and 9']
    },
    text: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('record', RecordSchema);