const mongoose = require('mongoose');
const ExerciseSchema = require('./Exercise').ExerciseSchema;
let Schema = mongoose.Schema;

let WorkoutSchema = new Schema({
	workoutName: String,
	workoutCreator: String,
	exercises: [String]
});

let Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;