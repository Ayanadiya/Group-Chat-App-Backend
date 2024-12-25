const express= require('express');

const router=express.Router();

const chatController=require('../Controller/chat');

router.get('/', chatController.getchatpage);

router.post('/addmessage', chatController.addmessage);

router.get('/getmessages/:lastmsgid', chatController.getallchat);

router.post('/upload', chatController.uploadfile);

module.exports=router;