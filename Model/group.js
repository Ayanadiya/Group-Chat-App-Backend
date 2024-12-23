const sequelize=require('../Util/db');
const Sequelize=require('sequelize');

const Group = sequelize.define('groups', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    groupname:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Group;