var express = require("express");
var router = express.Router();
var campgrd = require("../model/campground");
var comment = require("../model/comment");
var booking= require("../model/booking");

var Notification = require("../model/notification");
var user=require("../model/user");
var Review = require("../model/review");
var middleware=require("../middleware");
// display all list ofcampgounds 
// campgrd.create({
//     name:"srisalam hills",
//     image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
//     description:"this is the awesome u can ever see yipeee"

// },function(err,camps){
//     if(err){
//         console.log(err);

//     }else{
//         console.log(camps)
//     }
// });




// var camps=[
//     {name:"nagarjuna hills",image:"https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
//     {name:"srisalam hills",image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false"},
//     {name:"golconda hills",image:"https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.jpg"},
//     {name:"nagarjuna hills",image:"https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
//     {name:"srisalam hills",image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false"},
//     {name:"golconda hills",image:"https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.jpg"},

//     {name:"nagarjuna hills",image:"https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"},
//     {name:"srisalam hills",image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false"},
//     {name:"golconda hills",image:"https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.jpg"}


// ];
//router.get("/campgrounds",function(req,res)->1st way
//2nd way
router.get("/campgrounds", function (req, res) {
    var noMatch = null;
    var q = req.query.search ? req.query.search : '';
    var p = req.query.search1 ? req.query.search1 : '';
   
    if (q || p) {
        const regex = new RegExp(escapeRegex(q), 'gi');
        console.log(regex);
        const regex1 = new RegExp(escapeRegex(p), 'gi');
        // const regex1 = new RegExp(escapeRegex(p), 'gi');
        console.log(regex1)
       
        campgrd.find({ $and: [{ name: regex }, { description: regex1 } ] }, function (err, camps) {
            if (err) {
                console.log(err);
            }
           
                else{
                    res.render("campgrounds/campgrounds", { campgrounds: camps, noMatch: noMatch });
                }
        });
    } else {
        campgrd.find({}, function (err, camps) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("campgrounds/campgrounds", { campgrounds: camps, noMatch: noMatch });
            }
        });
    }
    //    res.render("campgrounds",{campgrounds:camps});
});

router.get("/getAllCampgrounds", function (req, res) {
    var noMatch = null;
    var q = req.query.search;
    var p = req.query.search1
   

    campgrd.find({}, function (err, camps) {
        if (err) {
            console.log(err);
        }
        else {
            res.json({ campgrounds: camps, noMatch: noMatch });

        }
    });

    //    res.render("campgrounds",{campgrounds:camps});
});

// creating the campgrounds in db
// router.post("/campgrounds",loggedIn,function(req,res)->1st way
//2nd way
router.post("/campgrounds", middleware.loggedIn, function (req, res) {

    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var location = req.body.location;
    var sublocation = req.body.sublocation;
    var price = req.body.price;
    var member=req.body.member;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, sublocation: sublocation, price: price,member:member }
    // creating a campgrounds and save to db
    campgrd.create(newCampground, function (err, newCamps) {
        if (err) {
            console.log(err)
            req.flash('error', err.message);
            res.redirect('back');
        }
        else {
            // redirect to camp grounds
            res.redirect("/campgrounds");
        }
    });
    // camps.push(newCampground);



    //get data from form and to camp array
    //redirect back to campground page

});
// router.post("/campgrounds", middleware.loggedIn, async function(req, res){
//     // get data from form and add to campgrounds array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var location = req.body.location;
//     var sublocation = req.body.sublocation;
//     var price = req.body.price;
//     var member=req.body.member;
//     var newCampground = {name: name, image: image, description: desc, author:author, location: location, sublocation: sublocation, price: price,member:member }

//     try {
//       let campground = await campgrd.create(newCampground);
//       let User = await user.findById(req.user._id).populate('notifications').exec();
//       let newNotification = {
//         username: req.user.username,
//         campgroundId: campground.id
//       }
//       for(const follower of User.bookings) {
//         let notification = await Notification.create(newNotification);
        
//         follower.notifications.push(notification);
//         follower.save();
//       }

//       //redirect back to campgrounds page
//       res.redirect(`/campgrounds/${campground.id}`);
//     } catch(err) {
//         console.log(err)
//       req.flash('error', err.message);
//       res.redirect('back');
//     }
// });
//form for making a campgrounds
// router.get("/campgrounds/new",loggedIn,function(req,res)->1st way
//2nd way
router.get("/campgrounds/new", middleware.loggedIn, function (req, res) {
    res.render("campgrounds/addCamp.ejs");
});
//show the description of individual camp grounds
//router.get("/campgrounds/:id",function(req,res)
//2nd way
// router.get("/:id",function(req,res){
//     campgrd.findById(req.params.id).populate("calendar").populate("comments").exec(function(err,Foundcamp){
//       if(err){
//          console.log(err);
//       }else{
//           console.log(Foundcamp);
//         res.render("campgrounds/infoCamps",{campi:Foundcamp});
//       }
//     });

// });
//********before review******* */
// router.get("/campgrounds/:id", function (req, res) {
//     campgrd.findById(req.params.id).populate("calendar").populate("comments").exec(function (err, Foundcamp) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(Foundcamp);
//             res.render("campgrounds/infoCamps", { campi: Foundcamp });
//         }
//     });

// });
//******afer review*******
// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function (req, res) {
    //find the campground with provided ID
    campgrd.findById(req.params.id).populate("comments").populate("bookings").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err,  Foundcamp) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            console.log(Foundcamp);
            res.render("campgrounds/infoCamps", { campi: Foundcamp });
        }
    });
});
//edit campgrouds
router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, function (req, res) {
    campgrd.findById(req.params.id, function (err, editCamp) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/editCamp", { campground: editCamp });
        }
    })

});
//update campgrounds
router.put("/campgrounds/:id", middleware.checkCampOwnership, function (req, res) {
    // delete req.body.campground.rating;
    campgrd.findByIdAndUpdate(req.params.id, req.body.camp, function (err, UpdateCamp) {
        if (err) {
            res.redirect("/campgrounds")
        }
        else {


            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})
//delete campground
//before review
// router.delete("/campgrounds/:id", middleware.checkCampOwnership, function (req, res) {
//     campgrd.findByIdAndDelete(req.params.id, function (err) {
//         if (err) {
//             res.redirect("/campgrounds");
//         } else {
//             res.redirect("/campgrounds");
//         }
//     })
// });
//after review
router.delete("/campgrounds/:id", middleware.checkCampOwnership, function (req, res) {
    campgrd.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});


//middleware

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;