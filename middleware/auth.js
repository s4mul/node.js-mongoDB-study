const { User } = require('../models/User')
let auth = (req, res, next) =>{
    //인증처리를 하는곳

    //쿠키에서 토큰 가져옴
    let token = req.cookies.x_auth;

    //유저를 찾고
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        req.token = token;
        req.user = user;
        next();
    })
    //있으면 okay, 없으면 NO
}

module.exports = { auth };