const path=require('path');

exports.gethomepage= (req,res,next) => {
    res.sendFile(path.join(__dirname,'../','views', 'signup.html'));
}