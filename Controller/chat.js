const path=require('path')
const Chat=require('../Model/chat');
const User=require('../Model/user');

exports.getchatpage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'chat.html'));
}

exports.addmessage= async (req, res, next) => {
    const {message} = req.body
    const {id, username} =req.user;
    try {
        const chat= await Chat.create({
            message:message,
            userId:id
        })
        res.status(201).json({message:chat.message, name:username});
    } catch (error) {
        res.status(500).json(error);
    }   
}

exports.getallchat= async (req,res,next) => {
    try {
        const chats= await Chat.findAll({
            include: [{
                model: User,
                attributes: ['username']
            }]
        });
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}