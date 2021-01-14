const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    plan_id: Number,
    exercise: {
        exercise_id: Number,
        order: String
    },
    created_date: Date,
    created_by_id: Number,
    is_created_by_doctor: String,
    is_deleted: Boolean 
});

const Plan = mongoose.model('plan', PlanSchema);

module.exports = Plan;