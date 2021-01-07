import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var UserSchema = new Schema({
    email: String,
    mobileNumber: String,
    title: String,
    firstName: String,
    lastName: String,
    yob: Number,
    passwordHash: String,
    passwordSalt: String
});

export default model('User', UserSchema);