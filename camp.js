var express=require("express");
var app=express();
var parser=require("body-parser");
var mongoose=require("mongoose");
var campgrd=require("./model/campground");
var booking=require("./model/booking");
var comment=require("./model/comment");

var user=require("./model/user");
var Notification = require("./model/notification");
var flash=require("connect-flash");
var methodOverride=require("method-override");
var passport=require("passport");
var passportlocal=require("passport-local");
var passportlocalmongoose=require("passport-local-mongoose");


// var seeddb=require("./seed");
//routes link
var commentRoutes=require("./routes/commentRoute");
var campgroundRoutes=require("./routes/campgrounds");
var authRoutes=require("./routes/auth");

var reviewRoutes = require("./routes/reviews");
var bookingRoutes = require("./routes/booking");

app.use(express.static("css"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/yelp_cz", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true  });
// seeddb();
app.use(methodOverride("_method"));
app.use(flash());
app.use(parser.urlencoded({extended:true}));
app.use(require("express-session")({
     secret:"this is yelp camp",
     resave:false,
     saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(async function(req, res, next){
    res.locals.currentuser = req.user;
   
    
    if(req.user) {
     try {
      console.log(req.user.bookings.id)
       let User = await user.findById(req.user._id);
       res.locals.bookings=User.bookings;
       
       res.locals.notifications = User.notifications;
       console.log(User.notifications,"asd");
      //  console.log(User,"users")
       console.log(res.locals.notifications,"nnnsnsnn");
     } catch(err) {
       console.log(err.message);
     }
    }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 })
//two way of doing routes 1st way
// app.use(authRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);
//second way
 app.use("/",authRoutes);
 app.use("/",campgroundRoutes);
 app.use("/campgrounds/:id/comments",commentRoutes);

 app.use("/campgrounds/:id/reviews", reviewRoutes);
 app.use("/",bookingRoutes);


app.listen(3000,function(){
    console.log("yelp camp server is started");
})