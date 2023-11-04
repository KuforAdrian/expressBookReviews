const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

let users = [];

const doesExist = (username)=>{
    let userwithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userwithsamename.length > 0){
        return true;
    } else{
        return false;
    }
}

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if(req.session.autorization){
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
        });
    } else{
        return res.status(403).json({message: "User not logged in"})
    }
});

app.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!doesExist(username)){
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else{
            return res.status(404).json({message: "User already exists!"});
        }
    } else if(!(username && password)){
            return res.status(404).json({message: "User name and password has not been provided"})
    }

    return res.status(404).json({message: "Unable to register user. "})
});


 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
