const mongoose = require('mongoose');

//Require Recipe model for connecting with Review
const Recipe = require('./Recipe')

const ReviewSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }
}, { timestamps: true });

module.exports = mongoose.model('Review, ReviewSchema');