var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise').Exercise;
const Workout = require('../models/Workout');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HomePage' });
});

/* GET profile Page */
router.get('/profile', (req,res,next)=>{
	res.render('profile', {title:'Profile Page'});
});

/* GET List of Workout Page */

router.get('/workouts_list', (req, res, next)=>{
	let promise = getExercises();
	promise.then((exercises)=>{
		Workout.find({}, (err, workouts)=>{
			if(err) return next(err);
			res.render('workouts_list', {title: 'Workout List', exercises: exercises, workouts:workouts });	
		});
		
	})
	
});

/* GET start Workout Page */
router.get('/workout_choice', (req, res, next)=>{
	Workout.find({}, (err, workouts)=>{
		if(err) return next(err);
		res.render('workout_choice', {title: 'Start a Workout', workouts: workouts});
	});
});

/* POST Workout Page with length and workout params*/
router.post('/workout', (req, res, next)=>{
	let length = req.body.time;
	let workoutName = req.body.workout;
	let promise = getExercises();
	promise.then((exercises)=>{
		Workout.findOne({workoutName: workoutName}, (err, workout)=>{
			if(err) return next(err);
			res.render('workout', {title: 'Workout!', length: length, workout: workout, exercises: exercises});
		});
	})

});

/* POST New Workout */
router.post('/workouts_list', (req, res, next)=>{
	let workoutName = req.body.name;
	let exercises = req.body.exerciseName;
	let workout = new Workout;
	workout.workoutName = workoutName;
	workout.workoutCreator = 'Admin';
	for(let i =0; i< exercises.length; i++){
		workout.exercises.push(exercises[i]);
	}

	workout.save();
	let promise = getExercises();
	promise.then((exercises)=>{
		Workout.find({}, (err, workouts)=>{
			if(err) return next(err);
			res.render('workouts_list', {title: 'Workout List', workouts: workouts, exercises:exercises});
		});
	})
	
});

/* PUT Modify Workout I created */

/* DELETE Workout created */

function getExercises(){
	let promise = Exercise.find({}).exec();
	return promise;
}

function getExerciseSchema(exerciseName){
	let promise = Exercise.find({exerciseName: exerciseName}).exec();
	return promise;
}

module.exports = router;
