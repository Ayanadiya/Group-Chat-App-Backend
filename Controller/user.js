const User=require('../Model/user');

const path=require('path');

const bcrypt=require('bcrypt');

exports.postsignup= async (req,res) => {
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;

    if(!name || !email || !phone || !password)
    {
        return res.status(400).json({message:'All fields are required'});
    }

    try {
        const saltround=10;
        const hashedpassword= await bcrypt.hash(password,saltround);
        const user= await User.create({
            username:name,
            email:email,
            phone:phone,
            password:hashedpassword
        })
        res.status(201).json({userdata:user, message:"Successfuly signed up"})
    } catch (error) {
        if(error.name==='SequelizeUniqueConstraintError')
        {
            res.status(400).json({message:"Email already have account, Please Login"});
            return;
        }
        console.log(error);
        res.status(500).json({error:error, message:"Could not add user"});
    }
}

exports.getloginpage= (req,res) => {
    res.sendFile(path.join(__dirname,'../','views','login.html'));
}