const express=require('express');

const userController=require('../Controller/user');

const router=express.Router();

router.post('/signup', userController.postsignup);

router.get('/loginpage', userController.getloginpage);

router.post('/login', userController.postlogin);

router.get('/activeuser', userController.getactiveusers);

router.put('/logout/:userId', userController.logout);

module.exports=router;