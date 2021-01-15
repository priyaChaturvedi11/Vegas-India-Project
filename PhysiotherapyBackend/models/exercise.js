import { Schema as _Schema, model } from 'mongoose';
var Schema = _Schema;

var ExerciseSchema = new Schema({
    title: String,
    image_path: String,
    video_path: String,
    difficulty_level: String,
    area: String,
    age_group: Number,
    assitance: String,
    aim: Array,
    joint: Array,
    movement_direction: Array,
    muscle: Array,
    precaution_instruction: Array,
    equipement: Array,
    instruction: [{
        instruction_name: String,
        order: Number,
        video_time_in_seconds: Number
    }]
});

export default model('Exercise', ExerciseSchema);