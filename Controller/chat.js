const path=require('path')
const Chat=require('../Model/chat');
const User=require('../Model/user');

exports.getchatpage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'chat.html'));
}

exports.addmessage= async (req, res, next) => {
    const {message, userId, username} = req.body
    try {
        const chat= await Chat.create({
            message:message,
            userId:userId
        })
        console.log(chat);
        res.status(201).json({message:chat.message, name:username});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }   
}

exports.getallchat= async (req,res,next) => {
    try {
        const messages = await Chat.findAll({
            include: [{
                model: User,
                attributes: ['username'] // Only fetch the username from the User model
            }]
        });
        const chats= messages.map(msg => ({
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