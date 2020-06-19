var campgrd=require("../model/campground");
var comment=require("../model/comment");
var Review = require("../model/review");

var middlewareObj={};

middlewareObj.checkCampOwnership=function(req, res, next) {
    //user logged in??
    if (req.isAuthenticated()) {
        //does user own the campground
        campgrd.findById(req.params.id, function (err, OwnerCamp) {
            if (err) {
                req.flash("error","Campground not found")
                res.redirect("back");

            } else {
                if (OwnerCamp.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    //else redirect somewhere
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    }
    else {
        //else redirect somewhere
        req.flash("error","You need to be login to do that")
       
        res.redirect("back");
    }
};
middlewareObj.checkCommentOwnership=function(req,res,next){
    //user logged in??
    if(req.isAuthenticated()){
        //does user own the campground
        comment.findById(req.params.comment_id,function(err,OwnerComment){
            if(err){
                res.redirect("back");

            }else{
                if(OwnerComment.author.id.equals(req.user._id)){
                    return next();
                }
                else{
                    req.flash("error","You don't have permission to do that")
                    //else redirect somewhere
                    res.redirect("back");
                }
            }
        });  
    } 
    else{
        //else redirect somewhere
        req.flash("error","You need to be login to do that")
        res.redirect("back");
    }
};
middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        campgrd.findById(req.params.id).populate("reviews").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/campgrounds/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};
middlewareObj.loggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","You need to be login to do that")
        res.redirect("/login");
    }
};


module.exports=middlewareObj