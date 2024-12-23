const Group= require('../Model/group');
const Groupuser=require('../Model/usergroup');
const Chat=require('../Model/chat');
const User=require('../Model/user');
const { where } = require('sequelize');

exports.createGroup= async (req,res,next) => {
    try {
        const {groupName, selectedUsers}=req.body;
        const creatorId=req.body.userId;
        const group= await Group.create({
            groupname:groupName,
            userId:creatorId,
        })
        await Groupuser.create({
            role:'admin',
            userId:creatorId,
            groupId:group.id
        })
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

exports.addmembers=async (req,res,next) => {
    try {
        const { userIdentifier, groupId } = req.body; // userIdentifier could be name, email, or phone
        const user = await User.findOne({
          where: {
            [Sequelize.Op.or]: [
              { username: userIdentifier },
              { email: userIdentifier },
              { phone: userIdentifier },
            ],
          },
        });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the user is already in the group
        const existingGroupUser = await Groupuser.findOne({
          where: { userId: user.id, groupId: groupId },
        });
    
        if (existingGroupUser) {
          return res.status(400).json({ message: 'User is already a member of the group' });
        }
    
        // Add the user as a member to the group (default role is 'member')
        await Groupuser.create({
          userId: user.id,
          groupId: groupId,
          role: 'member',  // default role
        });
    
        res.status(200).json({ message: 'User added to the group successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding user to the group' });
      }
}