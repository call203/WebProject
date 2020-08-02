const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true, //스페이스 없애는 역할

    },
    password:{
        type:String,
        mazlength:50
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

userSchema.pre('save',function( next){

    var user = this;
    if(user.isModified('password')){
         //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)


        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err) return next(err)
            
            user.password = hash
            next()
        });


    });
    
    }else{
        next()
    }
   
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err,isMAtch){
        if(err) return cb(err)

        cb(null, isMatch)
    })
}

userSchema.methods.comparePassword = function(plainPassword, cb){
    //암호화된 비밀번호 = 비밀번호?
    bcrypt.compare(plainPassword,this.password, function(err,isMatch){
        if(err) return db(err)

        cb(null,isMatch)
    })

}

userSchema.methods.generateToken = function(cb){
    //jsonwebtoken을 이용해서 token 이용
    var user = this;

    var token = jwt.sign(user._id.toHexString(),'screte')

    //user.id +"secretToken" = token을 가지고 user_id를 뽑아내 유저 구별
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
    

}

userSchema.statics.findByToken= function(token,cb){
    var user =this;

    //token을 decode한다.
    jwt.verify(token,'screte',function(err,decoded){
        //user_id를 이용해서 user를 찾아 클라이언트에서 가져온 토큰과 db의 토큰이 일치하는지 확인
        user.findOne({"_id" : decoded, "token": token}, function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
}
const User = mongoose.model('User',userSchema)

module.exports ={User}