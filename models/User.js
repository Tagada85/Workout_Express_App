const mongoose = require('mongoose');
const Workout = require('./Workout');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: {type: String, required: true},
	firstName: String,
	lastName: String,
	email: String,
	pastWorkouts: [{time: Number, workout: [String]}]
});

let User = mongoose.model('User', UserSchema);

module.exports = User;