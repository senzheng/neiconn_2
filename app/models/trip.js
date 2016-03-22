var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');



// define the schema for our user model
var tripSchema = mongoose.Schema({
    _id             : String,  // Trip id
    name            : String,
    local           : [{
             _id : String,
            name : String,
           image : String, 
        position : {
             _id : String,
            name : String,
             lat : String,
             lon : String
         }
        }],   // local guide
    official     :    [{
            _id  : String,
            name : String,
           image : String,
            lat  : String,
            lon  : String              
    }],
    tourist         :  [{
            _id  : String,
            name : String,
           image : String,
            lat  : String,
            lon  : String
    }]
    
});




// generating a hash
tripSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
tripSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Trip', tripSchema);