var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var placeSchema = mongoose.Schema({
          tags         :     [String],
          is_hidden    :      Boolean,
          title        :     {
                       en: String,
                       cn: String
            },
          introduction :       String,
          description  :       String,
          photos       :      {type: [String], default: ['http://www.davidluke.com/wp-content/themes/david-luke/media/ims/placeholder720.gif']},
          reviews      : Array,
          ratings      : Array,
          score        : Number,
          address      : String,
          minutes      : {type: Number, default: 90},
          admission    : String,
          phone        : String,
          website      : String,
          post_date    : {
                type   : Date,
                default: Date.now 
            },
          owner: {
                type   : mongoose.Schema.ObjectId,
                ref    : 'User'
            },
            media_id: {
                type    : mongoose.Schema.ObjectId,
                re      : 'Media'
            }
});

// generating a hash
placeSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
placeSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Place', placeSchema);
