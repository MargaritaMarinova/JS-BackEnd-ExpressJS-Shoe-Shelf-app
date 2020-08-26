const mongoose = require('mongoose');
const {Schema, model: Model} = mongoose;
const {String, ObjectId} = Schema.Types;
const bcrypt = require('bcrypt');
const saltRound = 11;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "The e-mail should be at least 3 symbols"]
    },

    fullName: {
        type: String,
        required: [true, "Please insert the Full name"]
    },

    password: {
        type: String,
        required: true,
        minlength: [3, "The password should be at least 3 symbols"]
    },

    offersBought: [{
        type: ObjectId,
        ref: 'Model'
    }]
});

userSchema.methods = {
    passwordsMatch(password) {
        return bcrypt.compare(password, this.password);
    }
}

userSchema.pre('save', function (next) {
    if(this.isModified('password')){
            
        bcrypt.genSalt(saltRound, (err, salt) => {
        
        if (err) {
            return next(err);
        }

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            this.password = hash;
            next(); 
        });
    });
    return;
}
next();
});

module.exports = new Model('User', userSchema);