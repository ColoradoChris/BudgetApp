var express = require('express'),
    router = express.Router(),
    Expense = require('../models/expense'),
    User = require('../models/user'),
    middleware = require('../middleware'),
    date = require('date-and-time');

//Get Route
router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('expense/new'); 
});

//Create Route
router.post('/', middleware.isLoggedIn, function(req, res){
    var type = req.body.type;
    var amount = req.body.amount;
    var date = req.body.date;
    var creator = {
      id: req.user._id,
      username: req.user.username
   };
   var newExpense = {
       type: type,
       amount: amount,
       date: date,
       creator: creator
   };
   User.findById(req.user._id, function(err, user){
       if(err){
           console.log(err);
       } else {
            Expense.create(newExpense, function(err, newlyCreated){
                if(err){
                    req.flash("error", "Something went wrong...");
                    res.redirect("back");
                } else {
                    user.expenses.push(newlyCreated);
                    user.save();
                    req.flash("success", "Expense successfully added!");
                    res.redirect("/dashboard");
                }
            });
       }
   });
});

//Edit Expense Route
router.get('/:id/edit', middleware.isLoggedIn, function(req, res) {
    Expense.findById(req.params.id, function(err, foundExpense){
        if(err){
         req.flash('error', 'Could not find the requested expense.');
         res.redirect('back');
        } else {
         res.render('expense/edit', {expense: foundExpense, date: date}); 
        }
    });
});

//Update Expense Route
router.put('/:id', middleware.isLoggedIn, function(req, res){
    var type = req.body.type;
    var amount = req.body.amount;
    var date = req.body.date;
    var creator = {
      id: req.user._id,
      username: req.user.username
    };
    var expense = {
       type: type,
       amount: amount,
       date: date,
       creator: creator
    };
   Expense.findByIdAndUpdate(req.params.id, expense, function(err, updatedIncome){
      if(err){
         console.log(err);
         req.flash('error', 'Could not update the selected expense.');
         res.redirect('/dashboard');
      } else {
         req.flash('success', 'Expense updated!');
         res.redirect('/dashboard');
      }
   });
});

//Destroy expense Route
router.delete('/:id', function(req, res){
   Expense.findByIdAndRemove(req.params.id, function(err){
      if(err){
         console.log(err);
         req.flash('error', 'Could not delete the selected expense.');
         res.redirect('/dashboard');
      } else {
         req.flash('success', 'Successfully deleted the expense!');
         res.redirect('/dashboard');
      }
   });
});

module.exports = router;