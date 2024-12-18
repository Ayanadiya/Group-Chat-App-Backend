const express=require('express');

const userController=require('../Controller/user');

const router=express.Router();

router.post('/signup', userController.postsignup);

module.exports=router;