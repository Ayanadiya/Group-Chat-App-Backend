const express=require('express');

const homepageController=require('../Controller/homepage');

const router=express.Router();

router.get('/', homepageController.gethomepage);

module.exports=router;