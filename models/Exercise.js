const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ExerciseSchema = new Schema({
	exerciseName: {type: String, required: true},
	bodyParts: String,
	videoUrl: String,
	thumbnail: String
});

let Exercise = mongoose.model('Exercise', ExerciseSchema);

exports.Exercise = Exercise;
exports.ExerciseSchema = ExerciseSchema