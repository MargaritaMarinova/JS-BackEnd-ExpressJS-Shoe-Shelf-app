const mongoose = require('mongoose');
const {Schema, model:Model} = mongoose;
const {String, Boolean, Number, ObjectId} = Schema.Types;


const modelSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 50
    },

    imageUrl: {
        type: String,
        required: true
    },

    price: {
        type: String,
        required: true,
        min: 0
    },

    brand: {
        type: String,
        required: true
    },

    isPublic: {
        type: Boolean,
        required: true,
        default: false

    },

    createdAt: {
        type: String,
        required: true
    },

    creator: {
        type: ObjectId,
        ref: 'User'
    },

    buyers: [{
        type: ObjectId,
        ref: 'User'
    }]

});

module.exports = new Model('Model', modelSchema);