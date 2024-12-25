const { io } = require('../app');
const path=require('path');
const Chat=require('../Model/chat');
const User=require('../Model/user');
const { where, Op } = require('sequelize');
const AWS= require('aws-sdk');

require('dotenv').config();
//const uploadToS3=require('../services/awss3');

exports.getchatpage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'chat.html'));
}

exports.addmessage= async (req, res, next) => {
    const {message, userId, username, groupId, fileUrl} = req.body
    try {
        const chat= await Chat.create({
            message:message,
            fileUrl:fileUrl,
            userId:userId,
            groupId:groupId
        })
        console.log(chat);
        //if (io) {
         //   io.emit('newMessage', {
          //    username,
          //    message: chat.message
           // });
         // } else {
          //  console.log('Socket.IO instance (io) is undefined');
         // }
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

exports.uploadfile = async(req,res,next) => {
  try {
    if (!req.files || !req.files.file) {
        console.log("No file")
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;  // Extract the file from req.files
    console.log(file);
    const fileUrl = await uploadToS3(file.data, file.name);  // Upload the file to S3
    res.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
}

function uploadToS3(data, filename){
    const BUCKETNAME = process.env.BUCKETNAME;
    const AWSACCESSKEY = process.env.AWSACCESSKEY;
    const AWSSECRETKEY = process.env.AWSSECRETKEY;

    // Initialize S3 client
    let s3bucket = new AWS.S3({
        accessKeyId: AWSACCESSKEY,
        secretAccessKey: AWSSECRETKEY
    });

    // Set the parameters for the S3 upload
    var params = {
        Bucket: BUCKETNAME,
        Key: filename,
        Body: data,  // Image data
        ACL: 'public-read',  // Set public read access (modify if needed)
        //ContentType: contentType,
       // ContentDisposition: 'attachment; filename="' + filename + '"'
    };

    // Return a promise for handling the response asynchronously
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('S3 UPLOAD ERROR');
                console.log(err);
                reject(err);  // Reject if there's an error during upload
                return;
            } else {
                resolve(s3response.Location);  // Resolve the promise with the URL of the uploaded file
            }
        });
    });
}

