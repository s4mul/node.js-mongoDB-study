if(process.env.NODE_ENV ==='production'){
    module.exports = require('./prod');
} else{
    module.exports = require('./dev');
}
//환경변수