const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    patient_id: Number,
    patient_title: String,
    patient_first_name: String,
    patient_last_name: String,
    patient_year_of_birth: Number,
    client_id: Number,
    history: {
        date: Date,
        text: String
    },
    doctor: {
        doctor_id: Number
    },
    appointment: {
        doctor_id: Number,
        date_time: Date,
        payment_status: String,
        visited: Boolean,
        plan_id: Number,
        date_assigned: Date,
        plan_validity_date: Date
    },
    plan_history: {
        plan_id: Number,
        date_time: Date,
        exercise_id: Number,
        accuracy_ratio: Number,
        speed_ratio: Number,
        error_descriptions: String
    },
    is_deleted: Boolean
});

const Patient = mongoose.model('patient', PatientSchema);

module.exports = Patient;