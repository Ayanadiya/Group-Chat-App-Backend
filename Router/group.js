const express = require('express');

const router=express.Router();

const groupController=require('../Controller/group');

router.post('/creategroup', groupController.createGroup);

router.get('/getgroup/:userId', groupController.getGroups);

router.get('/getgroupmessages/:id', groupController.getgroupmessages);

router.post('/addmember', groupController.addmembers);

router.get('/getgroupmembers/:groupId', groupController.getgroupmembers);

router.put('/addAdmin', groupController.addAdmin);

router.put('/deletemember', groupController.deleteMember);

module.exports=router;