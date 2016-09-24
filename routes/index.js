var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise').Exercise;
const Workout = require('../models/Workout');
const User = require('../models/User');
const passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HomePage', user: req.session.user });
});

/* GET profile Page */
router.get('/profile', (req,res,next)=>{
	User.findOne({username: req.session.user.username}, (err, user)=>{
		if(err) return next(err);
		console.log(user);
		console.log(req.session.user);
		res.render('profile', {title:'Profile Page', user: req.session.user, userProfile: user});
	})
});

/* GET List of Workout Page */

router.get('/workouts_list', (req, res, next)=>{
	let promise = getExercises();
	promise.then((exercises)=>{
		Workout.find({}, (err, workouts)=>{
			if(err) return next(err);
			res.render('workouts_list', {title: 'Workout List', exercises: exercises, workouts:workouts, user: req.session.user });	
		});
		
	})
	
});

router.get('/logout', (req, res, next)=>{
	if(req.session){
		req.session.destroy((err)=>{
			if(err) return next(err);
			res.redirect('/');
		});
	}
});

/* GET start Workout Page */
router.get('/workout_choice', (req, res, next)=>{
	Workout.find({}, (err, workouts)=>{
		if(err) return next(err);
		res.render('workout_choice', {title: 'Start a Workout', workouts: workouts, user: req.session.user});
	});
});

/* AUTH routes */

router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    User.findOne({username: req.user.username}, (err, user)=>{
    	if(err) return next(err);
    	req.session.user = user;
    	res.redirect('/');
    });
  });


/* POST Workout Page with length and workout params*/
router.post('/workout', (req, res, next)=>{
	let length = req.body.time;
	let workoutName = req.body.workout;
	if(!length){
		let err = new Error('You must enter a length to start a workout!');
		return next(err);
	}
	let promise = getExercises();
	promise.then((exercises)=>{
		Workout.findOne({workoutName: workoutName}, (err, workout)=>{
			if(err) return next(err);
			res.render('workout', {title: 'Workout!', length: length, workout: workout, exercises: exercises, user: req.session.user});
		});
	})

});

/* POST New Workout */
router.post('/workouts_list', (req, res, next)=>{
	let workoutName = req.body.name;
	let exercises = req.body.exerciseName;
	let workout = new Workout;
	workout.workoutName = workoutName;
	workout.workoutCreator = req.session.user.username;
	for(let i =0; i< exercises.length; i++){
		workout.exercises.push(exercises[i]);
	}

	workout.save();
	let promise = getExercises();
	promise.then((exercises)=>{
		Workout.find({}, (err, workouts)=>{
			if(err) return next(err);
			res.render('workouts_list', {title: 'Workout List', workouts: workouts, exercises:exercises, user: req.session.user});
		});
	})
	
});

router.post('/end_workout', (req, res, next)=>{
	let timeInSeconds = req.body.time;
	let workoutLength = parseInt(timeInSeconds) / 60;
	let workoutName = req.body.workout;
	User.findOne({username: req.session.user.username}, (err, user)=>{
		if(err) return next(err);
		user.pastWorkouts.push({time: workoutLength, workout: workoutName});
		user.save();
	});
	res.redirect('/profile');
});

/* PUT Modify Workout I created */

/* DELETE Workout created */
router.delete('/delete_workout/:id', (req, res, next)=>{
	let id = req.params.id;
	Workout.findById({_id: id}, (err, workout)=>{
		if(err) return next(err);
		workout.remove();
		res.redirect('/workouts_list');
	});
})


function getExercises(){
	let promise = Exercise.find({}).exec();
	return promise;
}

function getExerciseSchema(exerciseName){
	let promise = Exercise.find({exerciseName: exerciseName}).exec();
	return promise;
}

module.exports = router;
