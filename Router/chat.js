const express= require('express');

const router=express.Router();

const chatController=require('../Controller/chat');
const authenMiddleware=require('../middleware/authenticate');

router.get('/', chatController.getchatpage);

router.get('/addmessage', authenMiddleware.authenticate, chatController.addmessage);

router.get('/getmessages', chatController.getallchat);

module.exports=router;