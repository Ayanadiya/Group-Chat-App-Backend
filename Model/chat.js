const sequelize=require('../Util/db');
const Sequelize=require('sequelize');

const Chat= sequelize.define('chats', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:true
    },
    fileUrl:{
        type:Sequelize.STRING,
        allowNull:true
    }
});

module.exports=Chat;