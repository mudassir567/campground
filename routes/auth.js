var express=require("express");
var router=express.Router();
var passport=require("passport");
var user=require("../model/user");
var campgrd=require("../model/campground");
var Notification = require("../model/notification");
var middleware=require("../middleware");

// landing page
router.get("/",function(req,res){
    res.render("landing");
});


//auth routes
//sign up form
router.get("/signup",function(req,res){
         res.render("auth/signup");
});
//handling sign up 
router.post("/signup",function(req,res){
    var newUser=new user(
        {username:req.body.username,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            phonenumber:req.body.phonenumber,
            avatar:req.body.avatar
        
        }
        
        );

    user.register(newUser,req.body.password,function(err,user){
        if(err){
            // req.flash("error",err.message);
            // 1st way
            // console.log(err);
            // return res.render("auth/signup",{error:err.message});
            //  2nd way
            req.flash("error",err.message);
            return res.redirect("/signup");
           
        }
        else{
            
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp, "+user.username + "!")
                res.redirect("/campgrounds")
            })
        }
    });
           
});
//login form
router.get("/login",function(req,res){
    res.render("auth/login");
});
//handling login logic
//router.post("/login",middleware,callback)
//middleware=passport.aunthenticate("local",{ successRedirect:"/route",failureRedirect:"/route"})
// router.post("/login",passport.authenticate("local",{
//       successRedirect:"/campgrounds",
//       failureRedirect:"/login",
//       failureFlash: true,
//       successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
// }),function(req,res){

// });
router.post("/login", function (req, res, next) {
    passport.authenticate("local",
      {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
      })(req, res);
  });
//logout
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","logged you out");
    res.redirect("/");

});
// User Profile
router.get('/users/:id', async function(req, res) {
    try {
      let User = await user.findById(req.params.id).populate('followers').exec();
      res.render('auth/profile', { User });
    } catch(err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
  });
  
  // follow user
  // router.get('/follow/:id', middleware.loggedIn, async function(req, res) {
  //   try {
  //     let User = await user.findById(req.params.id);
  //     User.followers.push(req.user._id);
  //     User.save();
  //     req.flash('success', 'Successfully followed ' + User.username + '!');
  //     res.redirect('/users/' + req.params.id);
  //   } catch(err) {
  //     req.flash('error', err.message);
  //     res.redirect('back');
  //   }
  // });
  
  // // view all notifications
  // router.get('/notifications', middleware.loggedIn, async function(req, res) {
  //   try {
  //     let User = await user.findById(req.user._id).populate({
  //       path: 'notifications',
  //       options: { sort: { "_id": -1 } }
  //     }).exec();
  //     let allNotifications = User.notifications;
  //     res.render('notifications/index', { allNotifications });
  //   } catch(err) {
  //     req.flash('error', err.message);
  //     res.redirect('back');
  //   }
  // });
  
  // // handle notification
  // router.get('/notifications/:id', middleware.loggedIn, async function(req, res) {
  //   try {
  //     let notification = await Notification.findById(req.params.id);
  //     notification.isRead = true;
  //     notification.save();
  //     res.redirect(`/campgrounds/${notification.campgroundId}`);
  //   } catch(err) {
  //     req.flash('error', err.message);
  //     res.redirect('back');
  //   }
  // });
//middleware

module.exports=router;