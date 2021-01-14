﻿import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var UserSchema = new Schema({
    
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        },
    
    // email: String,
    mobileNumber: String,
    title: String,
    firstName: String,
    lastName: String,
    yob: Number,
    passwordHash: String,
    passwordSalt: String
});

export default model('User', UserSchema);