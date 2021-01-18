import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    mobileNumber: String,
    title: String,
    firstName: String,
    lastName: String,
    yob: Number,
    passwordHash: String,
    passwordSalt: String,
    registeration_date: Date,
    is_deleted: Boolean
});

export default model('User', UserSchema);