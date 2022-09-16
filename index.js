const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Sunwoo:s4mulsun@hellomongo.j8xwpyd.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true} ).then(()=>console.log('mongoDB Connected...'))
.catch(err => console.log(err));


app.get('/',(req, res) => res.send('hello world!'))

app.listen(port, () => console.log(`Example app listen on ${port}!`))