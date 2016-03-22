var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');



// define the schema for our tripgroup model
var tripgroupSchema = mongoose.Schema({
    _id             : String, // group id 
    trip_id         : String,  // trip id
    trip_name       : String, //  trip name
    contact         : [
            {
              _id   : String,
              name  : String,
            }
    ],
   
    member : [{
                member_id : String, // all members id n the froup  = the user's id
                member_name : String, // the members name
                member_type : String, // 1: Operator 2 : Tour operator 3 : local guide 4 : official guide 5 : Tourist
             }]
       
    
});




// generating a hash
tripgroupSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
tripgroupSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Tripgroup', tripgroupSchema);
