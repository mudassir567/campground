var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    username:String,
    password:String,
    avatar:String,
    firstname:String,
    lastname:String,
    phonenumber:Number,
    email:String,
    notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
           ref: 'Notification',
           isRead:  { type: Boolean, default: false }
        }
        
        
        
    ],
    followers: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'user'
    	}
    ],
    bookings: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'Booking'
    	}
    ],
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }

});
userSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("user",userSchema);