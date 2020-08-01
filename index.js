const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-Parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const config = require('./config/key')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log("MongoDB Connected!")).catch(err =>console.log(err))

app.get('/',(req,res) => res.send('Hello World!'))




app.post('/register',(req,res) => {
    //클라이언트의 회원가입 정보들을 DB에 넣어 줌

    const user = new User(req.body)
    
    user.save((err,userInfo) =>{
        if(err) return res.json({sucess:false, err})
        return res.status(200).json({
            sucess:true
        })
    })

})

app.listen(port, () => console.log('Example app listening!'))
