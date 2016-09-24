var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const TwitterStrategy = require('passport-twitter').Strategy;
const MongoStore = require('connect-mongo')(session);
const User = require('./models/User');

var routes = require('./routes/index');

var app = express();

User.findOne({username: 'Damien Cosset'}, (err, user)=>{
  if(err) throw err;
  user.pastWorkouts = [];
  user.save();
});

//db config
mongoose.connect('mongodb://Tagada85:kallon85@ds047642.mlab.com:47642/workout_app');
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('open', ()=>{
  console.log('Connected to db');
});

db.on('error', (err)=>{
  console.log('Error connected to db.' + err);
});

passport.use(new TwitterStrategy({
    consumerKey: 'aMIKXy7zeRyzaYvGcgnGh0RA2',
    consumerSecret: 'Uy8VER1wTXNaTWc88AQyr0BJNoXlTWxakVPkWCTDZF7uyBOx92',
    callbackURL: "https://thawing-waters-90908.herokuapp.com/auth/twitter/return"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    User.findOneAndUpdate({ username: profile.displayName},
      {
        username: profile.displayName
      },
      {upsert: true},
      done);
  }
));


//initialize passport
app.use(passport.initialize());

//Restore Session
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});
let sessionOptions = {
  secret: "this is a super secret dadada",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
};



app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
