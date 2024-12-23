const express=require('express');
const bodyParser=require('body-parser');
const path=require('path')
const cors=require('cors')

require('dotenv').config();

const sequelize=require('./Util/db');

const homepageRouter=require('./Router/homepage');
const userRouter=require('./Router/user');
const chatRouter=require('./Router/chat');
const groupRouter=require('./Router/group');

const errorController=require('./Controller/errorpage');

const User=require('./Model/user');
const Chat=require('./Model/chat');
const Group=require('./Model/group');
const Groupuser=require('./Model/usergroup');

const app=express();

app.use(cors({
    origin:"*"
}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'DOM')));
app.use(express.static(path.join(__dirname, 'views')));


app.use(homepageRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/group',groupRouter);
app.use(errorController.errorpage);


const port=process.env.PORT;

User.hasMany(Chat, { foreignKey: 'userId' });  // A User has many Chats
Chat.belongsTo(User, { foreignKey: 'userId' });  // A Chat belongs to a User
User.belongsToMany(Group, { through: Groupuser, foreignKey: 'userId', as: 'groups' });
Group.belongsToMany(User, { through: Groupuser, foreignKey: 'groupId', as: 'members' });
Group.hasMany(Chat, { foreignKey: 'groupId' });
Chat.belongsTo(Group, { foreignKey: 'groupId' });
Groupuser.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Groupuser, { foreignKey: 'userId' });
Groupuser.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(Groupuser, { foreignKey: 'groupId' });
//User.hasMany(Group);
//Group.hasMany(User);
//Chat.hasMany(Group);
//Group.hasMany(Chat);
//Groupuser.belongsTo(User);
//User.hasMany(Groupuser);
//Groupuser.belongsTo(Group);
//Group.hasMany(Groupuser);

sequelize.sync()
.then(result => {
    console.log("Database ready");
    app.listen(port || 3000);
})
.catch(err => console.log(err));