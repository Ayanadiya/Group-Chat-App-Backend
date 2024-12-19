const jwt= require('jsonwebtoken');
const User= require('../Model/user');

require('dotenv').config()

const secretkey="mydata";

const authenticate = (req,res,next) => {
    try {
        const token=req.header('Authorization')?.replace('Bearer ', '');
        console.log(token);
        const decoded = jwt.verify(token, process.env.SECRETKEYJWT);
        const userId = decoded.userId;
        console.log(userId)
        User.findByPk(userId)
        .then(user => {
            console.log(JSON.stringify(user));
            req.user=user;
            next();
        }).catch(err => { throw new Error(err)});
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:'false'});
    }
}

module.exports ={ authenticate };