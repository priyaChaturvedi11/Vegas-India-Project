// ./models/user-session.js

import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var UserSessionSchema = new Schema({
    sessionId: String,
    userId: String
});

export default model('UserSession', UserSessionSchema);

