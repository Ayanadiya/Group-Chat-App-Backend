const sequelize=require('../Util/db');
const Sequelize=require('sequelize');

const Groupuser= sequelize.define('groupmembers', {
    id:{
       type:Sequelize.INTEGER,
               allowNull:false,
               primaryKey:true,
               autoIncrement:true
    }
})

module.exports=Groupuser;