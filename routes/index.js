var express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    passport = require('passport');

//Root Route
router.get('/', function(req, res){
    res.render('index'); 
});

//Dashboard
router.get('/dashboard', function(req, res) {
    res.render('dashboard');
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