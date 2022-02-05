// Import mongoose to provide the schema for the database.
const mongoose = require('mongoose');

// Import the Schema.
const Schema = mongoose.Schema;

// Create the meta-pic schema.
const metaSchema = new Schema({
    object: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    telescope: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    fullImg:
    {
        type: String,
        required: true
    },
    // standImg:
    // {
    //     type: String,
    //     required: true
    // },
    // thumbImg:
    // {
    //     type: String,
    //     required: true
    // },
});

// Export the schema.
module.exports = mongoose.model('meta-pic', metaSchema);