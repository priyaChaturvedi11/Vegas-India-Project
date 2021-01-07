// ./models/booking.js

import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var BookingSchema = new Schema({
    ownerUserId: String,
    locationId: String,
    dateTimeFrom: Date,
    dateTimeTo: Date,
    numberOfAttendees: Number,
    needsNetwork: Boolean,
    needsConfPhone: Boolean,
    needsVideo: Boolean,
    needsInternet: Boolean
    // TODO: Add description field.
});

export default model('Booking', BookingSchema);