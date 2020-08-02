const {User} = require('../models/User');

let auth = (req,res, next)=>{
    /*인증처리를 하는곳*/

    //1.클라이언트 쿠키에서 token을 가져온다.
    let token = req.cookies.x_auth;

   
    //2. token을 복호화 한 후 user를 찾는다.
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        //4. user가 없으면 인증 no
        if(!user) return res.json({isAuth:false, err:ture})
        //3. user가 있으면 인증 okey
        req.token = token;
        req.user = user;
        next();
    })

    
    
}
module.exports={ auth };