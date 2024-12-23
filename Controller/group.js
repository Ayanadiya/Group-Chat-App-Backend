const Group= require('../Model/group');
const Groupuser=require('../Model/usergroup');
const Chat=require('../Model/chat');
const User=require('../Model/user');
const { where } = require('sequelize');

exports.createGroup= async (req,res,next) => {
    try {
        const {groupName, selectedUsers}=req.body;
        const group= await Group.create({
            groupname:groupName
        })
        // Add members to the group
        const groupMemberPromises = selectedUsers.map(async userId => {
            return Groupuser.create({
                userId: userId,
                groupId: group.id
            });
        });

        // Wait for all group members to be added
        await Promise.all(groupMemberPromises);
        res.status(201).json(group);
        } catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }


exports.getGroups= async (req,res,next) =>{
    try {
        const userId=req.params.userId;
        const groups= await Groupuser.findAll({where:{userId:userId},
            include:[{
                model: Group,
                attributes: ['groupname']
            }]
        });
        console.log(groups);
        res.status(200).json(groups);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

exports.getgroupmessages= async (req,res,next) => {
    try{
        const id=req.params.id;
        const messages= await Chat.findAll({
            attributes:['message'],
            include: [{
                model: User,
                attributes: ['username'] // Only fetch the username from the User model
            }],
            where:{groupId:id}}
        )
        console.log("group message:", messages);
        res.status(200).json(messages);
    }catch (error) {
        console.log(error);
        res.status(500).json(error);
    }  
}