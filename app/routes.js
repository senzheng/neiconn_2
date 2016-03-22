 var User       = require('../app/models/user');
 var Event      = require('../app/models/event');
 var Group      = require('../app/models/egroup');
 var Temp       = require('../app/models/temp');
 var Message    = require('../app/models/message');
 var Review     = require('../app/models/reviews');
 var Tripgroup  = require('../app/models/tripgroup');
 var Friendlist = require('../app/models/friendList');
 var Trip       = require('../app/models/trip');
 var Uwoplace   = require('../app/models/uwoplace');


var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport({
   service : "Gmail",
   auth : {
       user: "sen.zheng@neiconn.com",
       pass: "xethcotnleacuewx"
   }
});
 var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now()+file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

function showResult(result) {
    document.getElementById('latitude').value = result.geometry.location.lat();
    document.getElementById('longitude').value = result.geometry.location.lng();
}

function getLatitudeLongitude(callback, address) {
    // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
    address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
            }
        });
    }
}

function getEvent(event, id){
    for(var i = 0; i < event.length; i++){
        if(event[i]._id == id){
            return event[i];
        }
    }

    return null;
}


function check_join(applicants, id){
    for(var i = 0; i < applicants.length; i++){
        if(applicants[i].applicant_id == id){
            return true;
        }
    }

    return false;
}




module.exports = function(app, passport) {
   
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('main.ejs');
    });


    app.get('/guide/:id', function (req, res){
       Review.find({"reviews.content._id" : req.params.id},{},function (err, review){
        console.log('asdfasdfas');
         res.render('guide.ejs', {
            reviews : review
         });
       });
        
    });

    app.get('/confirm', function(req, res) {
        res.render('comfirm.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/applications',isLoggedIn ,function(req, res){

            Temp.find({"host.id" : req.user._id},{},function(err, temp){
                res.render("applications.ejs", {
                        user: req.user,
                        temps: temp
                    });
            })
        
    });

   app.get('/reviews', function(req, res) {
        res.render('reviewTemp.ejs');
    });

   app.get('/gps/:id', function(req, res) {
        Trip.find({"tourist._id" : req.params.id},{}, function (err, trip){
            console.log(trip);
             res.render('gps.ejs', {
                trips : trip
             });
        })
   })


  app.get('/uwogps/:id', function(req, res) {
        Trip.find({"tourist._id" : req.params.id},{}, function (err, trip){
            console.log(trip);
             res.render('uwogps.ejs', {
                trips : trip
             });
        })
   })


   app.get('/testTrip', function(req, res){
        var Newtrip = new Trip();
        Newtrip._id = "trip001";
        Newtrip.name = "trip001";
        Newtrip.local.push({"_id": "local001", "name" : "local001", "image" : "/images/iconmap.png", "position" : {"_id" : "place001", "name" : "place001", "lon" : "-118.352112" ,"lat": "34.133952"}});
        Newtrip.local.push({"_id": "local002", "name" : "local002", "image" : "/images/iconmap.png", "position" : {"_id" : "place002", "name" : "place002", "lon" : "-118.497629" ,"lat": "34.009176"}});
        Newtrip.local.push({"_id": "local003", "name" : "local003", "image" : "/images/iconmap.png", "position" : {"_id" : "place003", "name" : "place003", "lon" : "-118.144516" ,"lat": "34.147785"}});
        Newtrip.local.push({"_id": "local004", "name" : "local004", "image" : "/images/iconmap.png", "position" : {"_id" : "place004", "name" : "place004", "lon" : "-117.935282" ,"lat": "33.615441"}});
        Newtrip.local.push({"_id": "local005", "name" : "local005", "image" : "/images/iconmap.png", "position" : {"_id" : "place005", "name" : "place005", "lon" : "-117.732585" ,"lat": "33.989819"}});
        
        Newtrip.official.push({"_id" : "official001", "name" : "official001", "image" : "/images/owner1.jpg", "lon" : "-118.408530", "lat" : "33.941589" });

        Newtrip.tourist.push({"_id" : "tourist001", "name" : "tourist001" , "image" : "/images/owner3.jpg", "lon" : "-118.408530", "lat" : "33.941589"});
        Newtrip.tourist.push({"_id" : "tourist002", "name" : "tourist002" , "image" : "/images/owner4.jpg", "lon" : "-118.408530", "lat" : "33.941589"});
        Newtrip.tourist.push({"_id" : "tourist003", "name" : "tourist003" , "image" : "/images/owner5.jpg", "lon" : "-118.408530", "lat" : "33.941589"});
        Newtrip.tourist.push({"_id" : "tourist004", "name" : "tourist004" , "image" : "/images/owner6.jpg", "lon" : "-118.408530", "lat" : "33.941589"});
   

        Newtrip.save(function (err){
         if(err) throw err;

         console.log('GPS Group created!');
        });
     });

   app.post('/result', function(req,res){
       
      Event.find({},{},function (err, events){
        console.log(events);
        req.session.events = events;
        res.render('search-result.ejs',{
            event : events
        });
       
      })

   });

   

   app.post('/event', isLoggedIn_event,function(req,res){
       
     console.log(req.body.id);
     var id = req.body.id;
     var events = getEvent(req.session.events, id);
      res.render('event.ejs',{
            event : events,
            user  : req.user
        });
   });
    
   app.get('/chat/:id', function(req,res){
      Tripgroup.find({"member.member_id" : req.params.id}, function (err, group){
            
          Friendlist.find({"_id" : req.params.id}, function (err, list){

            console.log(group);
            console.log(list);
             res.render('chat.ejs',{
                    groups : group,
                    lists  : list
                });
          })
      })
   });

// 1: Operator 2 : Tour operator 3 : local guide 4 : official guide 5 : Tourist
   app.get('/testGroup', function (req, res){
       var Newtripgroup = new Tripgroup();

       Newtripgroup._id = "group001";
       Newtripgroup.name = "group001";
       Newtripgroup.trip_name = "trip001";
       Newtripgroup.trip_id   = "trip001";

       Newtripgroup.contact.push({"_id" : "local001", "name" : "local001"});
       Newtripgroup.contact.push({"_id" : "local002", "name" : "local002"});
       Newtripgroup.contact.push({"_id" : "official001", "name" : "official001"});
       Newtripgroup.contact.push({"_id" : "operator01", "name" : "operator01"});

       Newtripgroup.member.push({"member_id": "local001", "member_name" : "local001", "member_type" : 3});
       Newtripgroup.member.push({"member_id": "local002", "member_name" : "local002", "member_type" : 3});
       Newtripgroup.member.push({"member_id": "tourist001", "member_name" : "tourist001", "member_type" : 5});
       Newtripgroup.member.push({"member_id": "tourist002", "member_name" : "tourist002", "member_type" : 5});
       
       Newtripgroup.save(function (err){
        if(err) throw err;

        console.log('trip group created!');
       })
      
       var Newtripgroupone = new Tripgroup();

       Newtripgroupone._id = "group002";
       Newtripgroupone.name = "group002";
       Newtripgroupone.trip_name = "trip001";
       Newtripgroupone.trip_id   = "trip001";

       Newtripgroupone.contact.push({"_id" : "local003", "name" : "local003"});
       Newtripgroupone.contact.push({"_id" : "local004", "name" : "local004"});
       Newtripgroupone.contact.push({"_id" : "official002", "name" : "official002"});
       Newtripgroupone.contact.push({"_id" : "operator01", "name" : "operator01"});


       Newtripgroupone.member.push({"member_id": "local003", "member_name" : "local003", "member_type" : 3});
       Newtripgroupone.member.push({"member_id": "local004", "member_name" : "local004", "member_type" : 3});
       Newtripgroupone.member.push({"member_id": "tourist003", "member_name" : "tourist003", "member_type" : 5});
       Newtripgroupone.member.push({"member_id": "tourist004", "member_name" : "tourist004", "member_type" : 5});
       Newtripgroupone.save(function (err){
        if(err) throw err;

        console.log('trip group created!');
       })
  });

  app.get('/testlist', function (req, res){
    var Newfriendlist = new Friendlist();

    Newfriendlist._id = "tourist002";
    Newfriendlist.name = "tourist002";

    Newfriendlist.list.push({"_id" : "tourist001", "name" : "tourist001"});
    

    Newfriendlist.save(function (err){
        if(err) throw err;

        console.log('friendList created!')
    })
  });


  app.get('/getFriend/:id', function (req, res){
    Friendlist.findById(id, function (err, list){
            res.end(JSON.stringify(list));
        })
})


   app.get('/testTourist', function(req, res){
        var Newreview = new Review();
         Newreview._id = "tourist001";
         Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "place_id" : "place001","place_name" : "place001","type" : 1, "name" : "local001"}]});
         //Newreview.reviews[0].content.push("_id" : "local001", "type" : 1, "name" : "local001");
         //Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "type" : 1, "name" : "local001"}]});
         Newreview.reviews[0].content.push({"_id" : "local002", "type" : 1,"place_id" : "place002","place_name" : "place002", "name" : "local002"});
         Newreview.reviews[0].content.push({"_id" : "offical001", "type" : 2, "name" : "offical001"});
         Newreview.reviews[0].content.push({"_id" : "place001", "type" : 3, "name" : "place001"});
         Newreview.reviews[0].content.push({"_id" : "place002", "type" : 3, "name" : "place002"});
         
         

         Newreview.save(function(err){
                if(err) throw err;
                console.log('reviews queue created');
             });


  });

//:id is for test purpose
    app.get('/getReviews/:id', function(req, res){
        console.log(req.params.id);
        Review.find({"_id" : req.params.id},{}, function (err, review){
            res.render('reviews.ejs' , {
                reviews : review
            });
        });
    });
    
    app.get('getReviews/:id/:tripid', function(req, res){
      Review.find({"_id": req.params.id},{"reviews.trip_id": req.params.tripid}, function (err, review){
            res.render('reviews.ejs', {
                 reviews : review
            });
      });
    })

    app.get('/wallet', function(req, res){

         res.render('wallet.ejs');   
    });

    app.get('/uwochat/:id', function(req, res){
         Tripgroup.find({"member.member_id" : req.params.id}, function (err, group){
            
          Friendlist.find({"_id" : req.params.id}, function (err, list){

            console.log(group);
            console.log(list);
             res.render('uwochat.ejs',{
                    groups : group,
                    lists  : list
                });
          })
      })
    });

    app.post('/updateReview', function(req, res){
        console.log(req.body);
        Review.findById(req.body.id, function (err, review) {
           for(var i = 0; i < review.reviews.length; i++){
              console.log(review);
              if(req.body.trip_id == review.reviews[i].trip_id){
                  console.log(review.reviews[i]);
                  for(var j = 0; j < review.reviews[i].content.length; j++){
                    if(req.body.review_id == review.reviews[i].content[j]._id){
                        
                        if(req.body.rating != 0 && req.body.content != ""){
                            console.log(req.body.content);
                            review.reviews[i].content[j].rating = req.body.rating;
                            review.reviews[i].content[j].details = req.body.content;
                             review.reviews[i].content[j].time =  new Date();
                              review.reviews[i].content[j].status = 3;
                               review.save(function(err){
                                if(err) throw err;
                                console.log('reviews uploaded!');
                                
                            });
                        }else if(req.body.rating != 0 || req.body.content != ""){
                             //review.reviews[i].content[j].time =  new Date();
                              if(req.body.rating != 0){
                                review.reviews[i].content[j].rating = req.body.rating;
                              }

                              if(req.body.content != ""){
                               review.reviews[i].content[j].details = req.body.content;
                              }


                              review.reviews[i].content[j].status = 2;
                              
                              review.save(function(err){
                                if(err) throw err;
                                console.log('reviews uploaded!');
                            });
                        }
                          
                         

              
                        console.log(review.reviews[i].content[j]);

                        res.redirect('/getReviews/' + req.body.id)
                    }
                  }
              }
           }
        });
    });

 app.get('/testlocal', function(req, res){
      var Newreview = new Review();
         Newreview._id = "local001";
         Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "offical001", "type" : 2, "name" : "offical001"}]});
         //Newreview.reviews[0].content.push("_id" : "local001", "type" : 1, "name" : "local001");
         //Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "type" : 1, "name" : "local001"}]});
         //Newreview.reviews[0].content.push({"_id" : "local002", "type" : 1, "name" : "local002"});
         //Newreview.reviews[0].content.push({"_id" : "offical001", "type" : 2, "name" : "offical001"});
         //Newreview.reviews[0].content.push({"_id" : "place001", "type" : 3, "name" : "place001"});
         Newreview.reviews[0].content.push({"_id" : "place002", "type" : 3, "name" : "place002"});
         
         var NewreviewTwo = new Review();
         NewreviewTwo._id = "local002";
         NewreviewTwo.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "offical001", "type" : 2, "name" : "offical001"}]});
         //Newreview.reviews[0].content.push("_id" : "local001", "type" : 1, "name" : "local001");
         //Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "type" : 1, "name" : "local001"}]});
         //Newreview.reviews[0].content.push({"_id" : "local002", "type" : 1, "name" : "local002"});
         //Newreview.reviews[0].content.push({"_id" : "offical001", "type" : 2, "name" : "offical001"});
         //Newreview.reviews[0].content.push({"_id" : "place001", "type" : 3, "name" : "place001"});
         NewreviewTwo.reviews[0].content.push({"_id" : "place001", "type" : 3, "name" : "place001"});
         
         NewreviewTwo.save(function(err){
                if(err) throw err;
                console.log('reviews queue created');
             });


         Newreview.save(function(err){
                if(err) throw err;
                console.log('reviews queue created');
             });
 });

 app.get('/testoffical', function (req, res){
     var Newreview = new Review();
         Newreview._id = "offical001";
         Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "type" : 1, "place_id" : "place001","place_name" : "place001","name" : "local001"}]});
         //Newreview.reviews[0].content.push("_id" : "local001", "type" : 1, "name" : "local001");
         //Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "type" : 1, "name" : "local001"}]});
         Newreview.reviews[0].content.push({"_id" : "local002", "type" : 1,"place_id" : "place002","place_name" : "place002", "name" : "local002"});
         //Newreview.reviews[0].content.push({"_id" : "offical001", "type" : 2, "name" : "offical001"});
         Newreview.reviews[0].content.push({"_id" : "place001", "type" : 3, "name" : "place001"});
         Newreview.reviews[0].content.push({"_id" : "place002", "type" : 3, "name" : "place002"});
         
         

         Newreview.save(function(err){
                if(err) throw err;
                console.log('reviews queue created');
             });
 });

 app.get('/testOperator', function(req, res){
       var Newreview = new Review();
         Newreview._id = "operator001";
         Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "type" : 1,"place_id" : "place001","place_name" : "place001", "name" : "local001"}]});
         //Newreview.reviews[0].content.push("_id" : "local001", "type" : 1, "name" : "local001");
         //Newreview.reviews.push({"trip_id" : "trip001", "trip_name" : "tripAAA", "content" : [{"_id" : "local001", "type" : 1, "name" : "local001"}]});
         Newreview.reviews[0].content.push({"_id" : "local002", "type" : 1,"place_id" : "place002","place_name" : "place002", "name" : "local002"});
         //Newreview.reviews[0].content.push({"_id" : "offical001", "type" : 2, "name" : "offical001"});
         Newreview.reviews[0].content.push({"_id" : "tourop001", "type" : 3, "name" : "tourop001"});
         //Newreview.reviews[0].content.push({"_id" : "place002", "type" : 3, "name" : "place002"});
         
         

         Newreview.save(function(err){
                if(err) throw err;
                console.log('reviews queue created');
             });
 })


   app.post('/apply', isLoggedIn, function(req, res){
       console.log(req.body);
       console.log(req.user._id);

       Temp.findById(req.body.event_id , function(err, list){
          if(err) throw err;
           
         if(list.host.id == req.user._id){
            res.send("You can't Join This Event");
         }else if(list.applicants.length >= list.host.applicants){
            res.send("Sorry The Number is fully");
         }else if(check_join(list.applicants, req.user._id)){
            res.send("You have already applied this event!")
         }else {

           list.applicants.push({"applicant_id" : req.user._id, "applicant_photo" : req.user.facebook.photo, "applicant_name" : req.user.neiconn.firstname});
           list.save(function(err){
            if(err) throw err;

            console.log('apply successfully');
               smtpTransport.sendMail({
                        from: "Neiconn <sen.zheng@neiconn.com>", // sender address
                        to: " < " + req.user.facebook.email + ">", // comma separated list of receivers
                        subject: "Request Confirm", // Subject line
                        //text: "Hello world ✔",
                        html: "<h3>The event host has already received your request. Please be patient! Give the host little more time to process your request.</h3>"// plaintext body
                        }, function(error, response){
                   if(error){
                       console.log(error);
                   }else{
                       console.log("Message sent");
                   }
                });


               smtpTransport.sendMail({
                        from: "Neiconn <sen.zheng@neiconn.com>", // sender address
                        to: " < " + req.body.event_host+ ">", // comma separated list of receivers
                        subject: "Request Confirm", // Subject line
                        //text: "Hello world ✔",
                        html: "<h3>"+ req.user.facebook.givenName +" wants to join the event:"+ req.body.event_name +"</h3>" 
                        }, function(error, response){
                   if(error){
                       console.log(error);
                   }else{
                       console.log("Message sent");
                   }
                });
            res.redirect("/mypage");
          });
         }



       });
   });
   app.get('/getGroup', isLoggedIn,function(req, res){
        Group.find({"member.member_id" : req.user._id },{}, function (err, group){
            res.end(JSON.stringify(group));
        })
   });

    //Upload user info
    app.get('/editprofile', isLoggedIn, function(req, res) {
        res.render('profile-edit.ejs',{
            user : req.user
        });
    });

    app.post('/accept' ,isLoggedIn, function(req,res){

    });

    app.post('/sendMessage', isLoggedIn, function(req, res) {
        Message.findById(req.body.sender_id, function (err, messager){
           if (err) throw err;

           messager.outbox.push({"reciever_id" : req.body.reciever_id, "reciever_name" : req.body.reciever_name, "content" : req.body.content});
           messager.save(function (err) {
                if(err) throw err;

                console.log("Message saved!");
           });
        });

        Message.findById(req.body.reciever_id, function (err, messager){
          messager.inbox.push({"sender_id" : req.body.sender_id, "sender_name" : req.body.sender_name, "content" : req.body.content});
          messager.save(function (err) {
                if(err) throw err;

                console.log("Message sent!");
           });
        })

          
        res.redirect('/event');
    });
    
    app.get('/orders', function(req, res){
           res.render('orders.ejs');
    });

   app.get('/oporders', function(req, res){
            res.render('orderop.ejs');
   });

   app.get('/gorder', function(req, res){
             res.render('orderg.ejs');
   })


    app.post('/update_user', isLoggedIn, function(req, res){
        

        var id = req.body.id;
        
        User.findById(id, function(err, user) {
            if (err) throw err;
             console.log(user);
             user.neiconn.work = req.body.work;
             user.neiconn.birth.month = req.body.month;
             user.neiconn.birth.year  = req.body.year;
             user.neiconn.birth.day = req.body.day;
             user.neiconn.phone = req.body.phone;
             user.neiconn.location = req.body.location;
             user.neiconn.school = req.body.school;
             user.neiconn.about = req.body.about;
             user.neiconn.language = req.body.language;
            
             user.save(function(err){
                if (err) throw err;
                
                console.log('user successfully updated!');
                res.redirect("/mypage");
             });
        });

       
    });


    app.post('/admin', function(req, res){
      var id = req.body.id;
      console.log(req.body);
      
      res.render('admin.ejs');
    });

    app.get('/adminplace', function (req, res){
      // body...
      Uwoplace.find({},{}, function (err, data) {
           res.end(JSON.stringify(group));
      });
    });

    app.post('/addPlace', function (req, res){
        var Newuwoplace = new Uwoplace();


    });
    
    //get event




    app.post('/createevent', isLoggedIn, function(req, res){
        
        
        var id = req.body.id;
        

        Event.findById(id, function(err, event) {
            if(err) throw err;

            if(event){
                res.send("Sorry! Please create a valid activity");
            }else {

             var newEvent  = new Event();
             var newTemp   = new Temp();
             var newGroup  = new Group();
             console.log(newEvent);
             newEvent._id = Date.now();
             newEvent.category = "upcoming";
             newEvent.content.time = req.body.time;
             newEvent.content.duration  = req.body.duration;
             newEvent.content.date = req.body.date;
             newEvent.content.category = req.body.category;
             newEvent.content.title = req.body.title;
             newEvent.content.photo[0] = "images/sea.jpg";
             newEvent.content.price = req.body.price;
             newEvent.content.total_attendees = req.body.total_attendees;
             newEvent.user.email = req.body.email;
             newEvent.content.about = req.body.about;
             newEvent.content.rule[0] = req.body.rule;
             newEvent.content.location.address = req.body.address;
             newEvent.content.location.lat = req.body.lat;
             newEvent.content.location.lon = req.body.lon;
             newEvent.content.language = req.body.language;
             newEvent.content.venue = req.body.venue;
             newEvent.content.provision = req.body.provision;
             newEvent.user.reviews = req.body.reviews;
             newEvent.user.rating = req.body.rating;
             newEvent.user.name = req.body.name;
             newEvent.user.role = "host"; //host must
             newEvent.user.photo = req.body.photo,
             newEvent.user._id = id;
             
             newGroup._id = newEvent._id;
             newGroup.event.event_picture = newEvent.content.photo[0];
             newGroup.event.event_date = newEvent.content.date;
             newGroup.event.event_time = newEvent.content.time;
             newGroup.event.event_duration = newEvent.content.duration;
             newGroup.event.event_amount = newEvent.content.total_attendees;
             newGroup.event.event_title  = newEvent.content.title;
             newGroup.member.push({"member_id" : newEvent.user._id, "member_photo": newEvent.user.photo});
             newGroup.contentStoage.push({"member_id" : newEvent.user._id, "member_content": "welcome to join this group"});

             newTemp._id = newEvent._id;
             newTemp.host.name = newEvent.user.name;
             newTemp.host.id   = newEvent.user._id;
             newTemp.host.applicants = 2 * newEvent.content.total_attendees;
             newTemp.applicants = [];
             
             newTemp.save(function(err){
                if(err) throw err;
                console.log('applicants queue created');
             });


             newGroup.save(function(err){
                if(err) throw err;

                console.log('group created!');
             });

             newEvent.save(function(err){
                if (err) throw err;
                
                console.log('user successfully updated!');
                res.redirect("/mypage");
             });
            }

        });

       
    });
   
    app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
    

    console.log(req.file.filename);
        
    });
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        app.get('/home', function (req, res) {

            res.render('home.ejs', {message: req.flash('open Home') });
            // body...
        })

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/mypage',
                failureRedirect : '/'
            }));




// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/mypage',
                failureRedirect : '/'
            }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

    app.get('/reviews', function(req, res){

    });
// General Pages
    app.get('/main', function (req, res) {

            res.render('main.ejs');
            // body...
        });

    app.get('/mypage', isLoggedIn, function(req, res) {
        res.render('mypage.ejs', {
            user : req.user
        });
    });
   
    app.get('/post_event', isLoggedIn, function(req, res) {
        res.render('post_event.ejs', {
            user : req.user
        });
    });
};



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send("Please sign up and log in");
}

function isLoggedIn_event(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log(req.body.id);
     var id = req.body.id;
     var events = getEvent(req.session.events, id);
      res.render('event.ejs',{
            event : events,
            user  : null
        });
}
