const express=require('express');
const bodyParser=require('body-parser');
const path=require('path')

require('dotenv').config();

const sequelize=require('./Util/db');

const homepageRouter=require('./Router/homepage');
const userRouter=require('./Router/user');

const errorController=require('./Controller/errorpage');

const app=express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'DOM')));
app.use(express.static(path.join(__dirname, 'views')));


app.use(homepageRouter);
app.use('/user', userRouter);
app.use(errorController.errorpage);

const port=process.env.PORT;

sequelize.sync()
.then(result => {
    console.log("Database ready");
    app.listen(port || 3000);
})
.catch(err => console.log(err));