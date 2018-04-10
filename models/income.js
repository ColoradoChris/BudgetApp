var mongoose = require('mongoose');

var incomeSchema = new mongoose.Schema({
   amount: Number,
   type: String, 
   date: {
       type: Date,
       default: Date.now()
   },
   creator: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Income", incomeSchema);