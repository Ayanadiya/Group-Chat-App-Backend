const express = require('express');

const router=express.Router();

const groupController=require('../Controller/group');

router.post('/creategroup', groupController.createGroup);

router.get('/getgroup/:userId', groupController.getGroups);

router.get('/getgroupmessages/:id', groupController.getgroupmessages);

module.exports=router;