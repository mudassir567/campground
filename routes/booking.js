var express=require("express");
var router=express.Router({mergeParams:true});
var campgrd=require("../model/campground");
var booking=require("../model/booking");
var Notification = require("../model/notification");
var user=require("../model/user");
var middleware=require("../middleware");

const getCampById = (req,res,next,id) => {
    campgrd.findById(id).exec((err,camp)=>{
        if(err){
            return res.status(400).json({
                error: "Camp not found in DB"
            })
        }
        req.camp = camp;
        next();
    })
}
const getUserById = (req,res,next,id) => {
    user.findById(id).exec((err,user)=>{
        if(err|| !user){
            return res.status(400).json({
                error: "user not found in DB"
            })
        }
        req.profile = user;
        next();
    })
}
const getBookingById = (req,res,next,id) => {
    user.findById(id).exec((err,book)=>{
        if(err || !book){
            return res.status(400).json({
                error: "booking not found in DB"
            })
        }
        req.booking = book;
        next();
    })
}


router.param("campId", getCampById);

router.param("userId", getUserById);
router.param("bookingId", getBookingById);
router.get("/campgrounds/:campId/users/:id/bookings",function(req,res){


    user.findById(req.params.id).populate('bookings').exec(function(err,bookinguser){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(req.camp._id)
                    
                    res.render("bookings/addbooking",{campgrounds_id:req.camp._id,campground:bookinguser});
                                
                }
             })
   
    
});
    //working can be used
//    user.findById(req.params.id).populate('bookings').exec(function(err,bookinguser){
//         if(err){
//             console.log(err);
//         }
//         else{
            
//             res.render("bookings/addbooking",{campground:bookinguser});
       
//         }
//     })
//working can be used till here
//+++++++//
// })

//     try {
//         let campground =  user.findById(req.params.id).populate('bookings').exec();
//         res.render('bookings/addbooking', { campground });
//       } catch(err) {
//         req.flash('error', err.message);
//         return res.redirect('back');
//       }
    
// })
// router.post("/campgrounds/:id/bookings/:uid",function(req,res){
//     campgrd.findById(req.params.id,function(err,campground){
//         if(err){
//             console.log(err);

//         }
//         else
//         {
            
            
//             booking.create(req.body.bookings,function(err,booking){

//                 if(err){
//                     console.log(err);
//                 }
//                 else{   
                  
                
                    
//                     console.log(campground.author.id,"!!!!!!!!!!");
                    
//                     console.log(req.user.username,"aaaaa");
//                     console.log(campground.id)
//                     console.log(campground.author.id)
//                     console.log(booking.camp.id,"asdadad");
//                     // req.user._id=campground.author.id;
//                     // booking.camp.username.id=campground.author.id
//                     booking.booker.id=req.user._id;

//                     booking.booker.username=req.user.username;
//                     booking.save();
//                     console.log(  booking.booker.id,"asdadad");
//                     console.log(req.user._id,"111111");
//                     console.log(booking.booker.username,"qqqq");
//                     campground.bookings.push(booking);
//                     campground.save();
                      
//                     res.redirect("/campgrounds/"+campground._id);
//                 }
//             });
//         }
//     });
    
// });
router.post("/campgrounds/:campId/users/:id/bookings",function(req,res){
  
                    //   let User =  user.findById(req.params.id);
                    //     try {

                            
                    //         booking.create(req.body.bookings,function(err,book){
                                 
                    //             // let bookings=booking.create(req.params.id)
                    //                 //   console.log(book,"awqdeas")
                    //         console.log(req.params.id,"@@@");
                    //         console.log(req.user._id,"###");
                    //         book.booker.id=req.user._id;
                    //         book.booker.username=req.user.username;
                    //         book.save();
                    //         console.log(book,"da")
                    //         User.bookings.push(book); 
                    //         User.save();
                    //         req.flash('success', 'Successfully followed ' + User.username + '!');
                    //         res.redirect('/campgrounds/'+campground._id);
                    //         })
                           
                    //       } catch(err) {
                    //         req.flash('error', err.message);
                    //         res.redirect('back');
                    //       }
                 
                 //WORKING       
                //    user.findById(req.params.id,function(err,User){
                //        if(err){
                //            console.log(err);
                //        }
                //        else{
                //         try {

                            
                //             booking.create(req.body.bookings,function(err,book){
                                 
                //                 // let bookings=booking.create(req.params.id)
                //                     //   console.log(book,"awqdeas")
                //             console.log(req.params.id,"@@@");
                //             console.log(req.user._id,"###");
                //             book.booker.id=req.user._id;
                //             book.booker.username=req.user.username;
                //             book.save();
                //             console.log(book,"da")
                //             User.bookings.push(book); 
                //             User.save();
                //             console.log(User);
                //             console.log(User.campground);
                            
                //             req.flash('success', 'Successfully booking done to  ' + User.username + '!');
                //             res.redirect('/users/'+User._id+'/bookings');
                //             })
                           
                //           } catch(err) {
                //             req.flash('error', err.message);
                //             res.redirect('back');
                //           }
                //        }


                //    });
             
                        user.findById(req.params.id,function(err,User){
                            if(err){
                                console.log(err);
                            }
                            else{
                                 booking.create(req.body.bookings,function(err,book){
                                      
                                     // let bookings=booking.create(req.params.id)
                                         //   console.log(book,"awqdeas")
                                         
                                         try {
                                 console.log(req.params.id,"@@@");
                                 console.log(req.user._id,"###");
                                 book.booker.id=req.user._id;
                                 book.booker.username=req.user.username;
                                 book.save();
                                 console.log(book,"da")
                                 User.bookings.push(book); 
                                User.notifications.push(book);
                                 User.save();
                                 req.camp.bookings.push(book);
                                 req.camp.save();
                                 
                                
                              

                                 console.log(User);
                                

                                
                                 
                                 req.flash('success', 'Successfully booking done to  ' + User.username + '!');
                                 res.redirect('/campgrounds/'+req.camp._id+'/users/'+User._id+'/bookings');
                                
                                
                               } catch(err) {
                                 req.flash('error', err.message);
                                 res.redirect('back');
                               }

                            })

                            }
                           
                         
                        });
                 
                    
                    
           
            });


router.get('/user/:userId/notifications', middleware.loggedIn,  function(req, res) {
    const notifications=req.profile.notifications
    
    
    console.log(notifications);
    
    

    booking.find({},function(err,book){
       if(err){
           console.log(err);
       }
       else{
           console.log(book,"adsadfsds")
            res.render("bookings/notify",{notifications, userId:req.profile._id, bookings :book})
       }
    })
    
   
   
   
});

router.get('/user/:id/notifications/booking/:bookingI',middleware.loggedIn,function(req,res){
   user.findById(req.params.id,function(err,User){
       if(err){
           console.log(err);
       }
       else{
       
        
        booking.findById(req.params.bookingI,function(err,detail){
            res.render("bookings/detail",{detail:detail});
        })
       }
   })
     
})

module.exports=router