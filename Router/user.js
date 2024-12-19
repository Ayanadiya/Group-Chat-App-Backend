const express=require('express');

const userController=require('../Controller/user');

const router=express.Router();

router.post('/signup', userController.postsignup);

router.get('/loginpage', userController.getloginpage);

router.post('/login', userController.postlogin);

module.exports=router;