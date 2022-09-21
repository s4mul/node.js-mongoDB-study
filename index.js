const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require("./models/User");
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
const config = require('./config/key');
//application/x-www-form-urlencoded를 가져와서 분석하기 위함
app.use(bodyParser.urlencoded({extended: true}));
//application/json으로 된 것을 분석해서 가져오기 위함 
app.use(bodyParser.json())
app.use(cookieParser());
mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true} ).then(()=>console.log('mongoDB Connected...'))
.catch(err => console.log(err));



app.get('/',(req, res) => res.send('이거시 뭐시여'))
app.post('/api/users/register',(req,res)=>{   
    //회원가입할 때 필요한 정보들을 client에서 가져오면,
    //그 정보들을 DB에 넣어준다.

    const user = new User(req.body);

    //user모델에 정보가 저장됨
    //실패 시, 실패한 정보를 보내줌
    
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    }) 
})

app.post('/api/users/login',(req, res) =>{
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    console.log(User);
    User.findOne({ email: req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    
    user.comparePassword(req.body.password, (err, isMatch) => {
            // console.log('err',err)
    
            // console.log('isMatch',isMatch)
    
            if (!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
    
            //비밀번호 까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
    
            // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지 
            res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

app.get('api/users/auth', auth, (req, res) => {
    //여기까지 왔다는 것은 Authentication이 ture라는 뜻
    res.status(200).json({
        _id: req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname, 
        role: req.user.role,
        image: req.user.image
    })
})
app.get("/api/users/logout", auth, (req, res)=>{
    User.findOneAndUpdate({_id: req.user._id}, {token: ""},
    (err, user)=>{
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true
        })
    })
})
app.listen(port, () => console.log(`Example app listen on ${port}!`))