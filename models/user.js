let mongoose = require('mongoose');
let crypto = require('crypto');
let Schema = mongoose.Schema;

let UserSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: {
            type: String,
            match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
        },
        username: {
            type: String,
            unique: true,
            required: 'Username is required',//--> error message
            trim: true//--> gets only username without extra spaces
        },
        password: {
            type: String,
            //CUSTOM VALIDATOR--------------------------(returns only IF password is >6)
            validate: [(password) => {
                return password && password.length > 6;
            }, 'Password should be longer']//--> error message
        },
        salt: {
            type: String
        },
        provider: {
            type: String,
            required: 'Provider is required'//--> error message
        },
        providerId: String,
        providerData: {},

        //ALWAYS!---------------------------------
        created: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "user"
    }
);


//VIRTUALLY ---- not part of database--------(GET/SET)
UserSchema.virtual('fullName')
.get(function() {
    return this.firstName + ' ' + this.lastName;
})

.set(function(fullName) {
    let splitName = fullName.split(' ');//returns array of strings
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});


//MIDDLEWARE-----PRE-----------------------------------------
UserSchema.pre('save', function(next) {
    if (this.password) {
        //this creates an encrypted version of the password retrieved
        this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');//attribute 'salt' enhances encryption (by making EVERY password unique inside database)
        this.password = this.hashPassword(this.password);//envoke method to store new version of the password
    }
    next();
});


//Instance method---(creating obj 'hashpassword' to use)----->returns a very long string
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

//Instance method---(creating obj 'authenticate' to use)
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};





UserSchema.statics.findUniqueUsername = function(username, suffix,
    callback) {
    var possibleUsername = username + (suffix || '');
    this.findOne({
        username: possibleUsername
    }, (err, user) => {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return this.findUniqueUsername(username, (suffix || 0) +
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

module.exports = mongoose.model('User', UserSchema);