const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    exercise_id: Number,
    title: String,
    equipement: {
        equipement_name: String
    },
    image_path: String,
    video_path: String,
    difficulty_level: String,
    area: String,
    age_group: String,
    assitance: String,
    aim: {
        aim_name: String
    },
    joint: {
        joint_name: String
    },
    movement_direction: {
        movement_direction_name: String
    },
    muscle: {
        muscle_name: String
    },
    precaution_instruction: {
        precaution_instruction_name: String
    },
    instruction: {
        instruction_name: String,
        order: String,
        video_time_in_seconds: TimeRanges
    }
});

const Exercise = mongoose.model('exercise', ExerciseSchema);

module.exports = Exercise;