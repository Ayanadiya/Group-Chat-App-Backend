const { io } = require('../app');
const path=require('path')
const Chat=require('../Model/chat');
const User=require('../Model/user');
const { where, Op } = require('sequelize')

exports.getchatpage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'chat.html'));
}

exports.addmessage= async (req, res, next) => {
    const {message, userId, username, groupId} = req.body
    try {
        const chat= await Chat.create({
            message:message,
            userId:userId,
            groupId:groupId
        })
        console.log(chat);
        if (io) {
            io.emit('newMessage', {
              username,
              message: chat.message
            });
          } else {
            console.log('Socket.IO instance (io) is undefined');
          }
        res.status(201).json({chat:chat, name:username});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }   
}

exports.getallchat= async (req,res,next) => {
    const lastmsgid=req.params.lastmsgid;
    if(lastmsgid===undefined)
    {
        lastmsgid=-1;
    }
    try {
        const messages = await Chat.findAll({
            include: [{
                model: User,
                attributes: ['username'] // Only fetch the username from the User model
            }],
            where:{id:{[Op.gt]:lastmsgid}}
        });
        const chats= messages.map(msg => ({
            id:msg.id,
            message: msg.message,
            username: msg.user.username
        })
    )
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}