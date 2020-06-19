var mongoose = require("mongoose");
 
var bookingSchema = new mongoose.Schema({
    price: String,
    username:String,
    
   
    booker:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String

    },
    
});
 
module.exports = mongoose.model("Booking", bookingSchema);