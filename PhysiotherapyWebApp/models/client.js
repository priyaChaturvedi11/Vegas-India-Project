const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    mobile_number: Number,
    email: String,
    title: String,
    first_name: String,
    last_name: String,
    year_of_birth: Number,
    registration_date: Date,
    favourite_exercise: {
        exercise_id: Number
    },
    patient: {
        patient_id: Number,
        patient_relation_with_client: String
    },
    is_deleted: Boolean
});

const Client = mongoose.model('client', ClientSchema);

module.exports = Client;