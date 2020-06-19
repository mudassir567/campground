var mongoose=require("mongoose");
var campSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    location:String,
    sublocation:String,
    price:String,
    member:String,
     
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String
    },
    comments:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
         }
     ],
     
    bookings:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Booking"
        }
    ],
    
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});
module.exports=mongoose.model("Campground",campSchema);