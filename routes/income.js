var express = require('express'),
    router = express.Router(),
    Income = require('../models/income'),
    User = require('../models/user'),
    middleware = require('../middleware'),
    date = require('date-and-time');

router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('income/new'); 
});

router.post('/', middleware.isLoggedIn, function(req, res){
    var type = req.body.type;
    var amount = req.body.amount;
    var date = req.body.date;
    var creator = {
      id: req.user._id,
      username: req.user.username
   };
   var newIncome = {
       type: type,
       amount: amount,
       date: date,
       creator: creator
   };
   User.findById(req.user._id, function(err, user){
       if(err){
           console.log(err);
       } else {
            Income.create(newIncome, function(err, newlyCreated){
                if(err){
                    req.flash("error", "Something went wrong...");
                    res.redirect("back");
                } else {
                    user.incomes.push(newlyCreated);
                    user.save();
                    req.flash("success", "Income successfully added!");
                    res.redirect("/dashboard");
                }
            });
       }
   });
});

//Edit Income Route
router.get('/:id/edit', middleware.isLoggedIn, function(req, res) {
    Income.findById(req.params.id, function(err, foundIncome){
        if(err){
         req.flash('error', 'Could not find the requested income.');
         res.redirect('back');
        } else {
         res.render('income/edit', {income: foundIncome, date: date}); 
        }
    });
});

//Update Income Route
router.put('/:id', middleware.isLoggedIn, function(req, res){
    var type = req.body.type;
    var amount = req.body.amount;
    var date = req.body.date;
    var creator = {
      id: req.user._id,
      username: req.user.username
    };
    var income = {
       type: type,
       amount: amount,
       date: date,
       creator: creator
    };
   Income.findByIdAndUpdate(req.params.id, income, function(err, updatedIncome){
      if(err){
         console.log(err);
         req.flash('error', 'Could not update the selected income.');
         res.redirect('/dashboard');
      } else {
         req.flash('success', 'Income updated!');
         res.redirect('/dashboard');
      }
   });
});

module.exports = router;