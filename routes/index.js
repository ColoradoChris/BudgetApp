var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    passport = require('passport'),
    date = require('date-and-time'),
    middleware = require('../middleware');

var months = {"All": "01", "January": "01", "February": "02", "March": "03", "April": "04", "May": "05", "June": "06", "July": "07", "August": "08", "September": "09", "October": "10", "November": "11", "December": "12"};

//Root Route
router.get('/', function(req, res){
    res.render('index'); 
});

//Dashboard
router.get('/dashboard', middleware.isLoggedIn, function(req, res) {
     if(req.query.year != "All" && req.query.month === "All"){
        User.findById(req.user._id).populate({path: 'incomes', match: {date: {$gte: new Date(req.query.year  + "-01-01T00:00:00Z"), $lte: new Date(req.query.year  + "-12-31T00:00:00Z")} }}).populate({path: 'expenses', match: {date: {$gte: new Date(req.query.year  + "-01-01T00:00:00Z"), $lte: new Date(req.query.year  + "-12-31T00:00:00Z")} }}).exec(function(err, user){
            if(err){
                console.log(err);
                req.flash("err", "Somethign went wrong");
                res.redirect('back');
            } else {
                res.render('dashboard', {user: user, date: date});
            }
        });
    } else if((req.query.year != undefined) && (req.query.month != undefined)){
        User.findById(req.user._id).populate({path: 'incomes', match: {date: {$gte: new Date(req.query.year + "-" + months[req.query.month]  + "-01T00:00:00Z"), $lte: new Date(req.query.year + "-" + months[req.query.month] + "-31T00:00:00Z")} }}).populate({path: 'expenses', match: {date: {$gte: new Date(req.query.year + "-" + months[req.query.month] + "-01T00:00:00Z"), $lte: new Date(req.query.year + "-" + months[req.query.month] + "-31T00:00:00Z")} }}).exec(function(err, user){
            if(err){
                console.log(err);
                req.flash("err", "Somethign went wrong");
                res.redirect('back');
            } else {
                res.render('dashboard', {user: user, date: date});
            }
        });
    } else {
        User.findById(req.user._id).populate('incomes').populate('expenses').exec(function(err, user){
            if(err){
                console.log(err);
                req.flash("err", "Somethign went wrong");
                res.redirect('back');
            } else {
                res.render('dashboard', {user: user, date: date});
            }
        });
    }
});

//Register Get Route
router.get('/signup', function(req, res){
    res.render('signup');
});

//Register Post Route
router.post('/signup', function(req, res){
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/signup');
        } else {
            passport.authenticate('local')(req, res, function(){
                req.flash('success', 'Welcome to Budgeter, ' + user.username + '!');
                res.redirect('/dashboard'); 
            });
        }
    }); 
});

//Login Routes
router.get('/login', function(req, res) {
   res.render('login');
});

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
    }), function(req, res) { 
});

//Logout Route
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You have successfully logged out!');
    res.redirect('/');
});

module.exports = router;