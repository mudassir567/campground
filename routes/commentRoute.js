var express=require("express");
var router=express.Router({mergeParams:true});
var campgrd=require("../model/campground");
var comment=require("../model/comment");
var middleware=require("../middleware");
//comment route for form
//router.get("/campgrounds/:id/comments/new",loggedIn,function(req,res){->1st way replace
//2nd way
router.get("/new",middleware.loggedIn,function(req,res){
    campgrd.findById(req.params.id,function(err,commentpage){
       if(err){
           console.log(err);
       }
       else{
        res.render("comments/addComment",{campgrounds:commentpage});
       }
    });
  
});
// router.post("/campgrounds/:id/comments",loggedIn,function(req,res){->1st way
//comment save
//2nd way
router.post("/",middleware.loggedIn,function(req,res){
    campgrd.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);

        }
        else{
            comment.create(req.body.comments,function(err,comment){

                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id)
                }
            });
        }
    });
    
});
//comment edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    comment.findById(req.params.comment_id,function(err,editComment){
        if(err){
            res.redirect("back");
        }
        else{

            res.render("comments/edit",{campgrounds_id:req.params.id,comment:editComment});
        }
    })

});
//comment update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comments,function(err,updateComment){
     if(err){
         res.redirect("back");
     }
     else{
         res.redirect("/campgrounds/"+req.params.id);
     }
    });
});
//comment delete
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
  comment.findByIdAndDelete(req.params.comment_id,function(err,deleteComment){
      if(err){
          res.redirect("back");
      }
      else{
         req.flash("success","comment deleted");
          res.redirect("/campgrounds/"+req.params.id);
      }
  });
});


module.exports=router;
