const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');
//application/x-www-form-urlencoded를 가져와서 분석하기 위함
app.use(bodyParser.urlencoded({extended: true}));
//application/json으로 된 것을 분석해서 가져오기 위함 
app.use(bodyParser.json())

mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true} ).then(()=>console.log('mongoDB Connected...'))
.catch(err => console.log(err));



app.get('/',(req, res) => res.send('이거시 뭐시여'))
app.post('/register',(req,res)=>{   
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


app.listen(port, () => console.log(`Example app listen on ${port}!`))