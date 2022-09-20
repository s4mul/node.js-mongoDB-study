const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;//몇글자인지

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp:{
        type: Number
    }
});

userSchema.pre('save', function(next){

    var user = this;
    //비밀번호 암호화시킨다.
    //bcrypr를 사용함.
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            //salt를 만들고 saltround자릿수의
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }
    
});

const User = mongoose.model('User',userSchema);

module.exports = {User}