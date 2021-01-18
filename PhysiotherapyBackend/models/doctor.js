import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var DoctorSchema = new Schema({
    email: String,
    mobileNumber: String,
    title: String,
    firstName: String,
    lastName: String,
    yob: Number,
    passwordHash: String,
    passwordSalt: String,
    registeration_date: Date,
    patient_id: Array,
    appointment: [{
        appointment_id: Schema.Types.ObjectId,
        patient_id: Schema.Types.ObjectId,
        date: Date,
        payment_status: Number,
        visited: Number,
        plan_id: Schema.Types.ObjectId
    }],
    is_deleted: Boolean
});

export default model('Doctor', DoctorSchema);