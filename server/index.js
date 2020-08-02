const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-Parser')
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const config = require('./config/key');
const { User } = require("./models/User");
const {auth} = require("./middleware/auth");

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log("MongoDB Connected!")).catch(err =>console.log(err))



app.get('/',(req,res) => res.send('Hello World!'))



app.post('api/users/register',(req,res) => {
    //클라이언트의 회원가입 정보들을 DB에 넣어 줌

    const user = new User(req.body)
    
    user.save((err,userInfo) =>{
        if(err) return res.json({sucess:false, err})
        return res.status(200).json({
            sucess:true
        })
    })

})

/**
 * 로그인
 */
app.post('/api/users/login',(req,res)=>{

    //1.요청된 정보를 DB에서 존재확인
    User.findOne({email:req.body.email}, (err, user) =>{
        if(!user){
            return res.json({
                loginSuess:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }


        //2.요청된 비밀번호와 DB 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err,isMatch)=>{
        if(!isMatch){
            return res.json({
                loginSuess:false,
                message:"비밀번호가 틀렸습니다."
            })
        }else{
            //3.token생성
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);

                //4.toekn을 저장한다.(쿠키, 로컬스토리지..)
                res.cookie("x_auth",user.token).status(200).json({
                    loginSucess:true,
                    userId:user._id
                })

            })
        }      
    })

    })

})

app.post('/api/users/auth',auth,(req,res)=>{
    //미틀웨어를 통과했다면 인증 통과했다는 것.

    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.role ===0 ? false:true,
        isAuth:true,
        email:req.user.email,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })
})

/**
 * 로그아웃
 */
app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},{token:""},(err,user) =>{
        if(err) return res.json({sucess:false,err});
        return res.status(200).send({
            success:true
        })
    })
})

app.get('/api/hello',(req,res)=>{
    res.send("안녕하세요")
})

app.listen(port, () => console.log('Example app listening!'))
