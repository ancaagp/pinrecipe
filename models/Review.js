const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
