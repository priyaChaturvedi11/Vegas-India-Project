const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    mobile_number: Number,
    email: String,
    title: String,
    first_name: String,
    last_name: String,
    year_of_birth: Number,
    registration_date: Date,
    patient: {
        patient_id: Number
    },
    appointment: {
        patient_id: Number,
        date: Date,
        payment_status: String,
        visited: Boolean,
        plan_id: Number
    },
    is_deleted: Boolean
});

const Doctor = mongoose.model('doctor', DoctorSchema);

module.exports = Doctor;