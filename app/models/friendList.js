var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');



// define the schema for our tripgroup model
var friendlistSchema = mongoose.Schema({
    _id             : String,  // user id
    name            : String, //  user name
   
    

    list           : [
           {
             _id :  String,
             name: String,
           }
    ]
});




// generating a hash
friendlistSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
friendlistSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Friendlist', friendlistSchema);