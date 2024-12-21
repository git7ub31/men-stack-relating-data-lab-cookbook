const express = require('express');
const router = express.Router();  //capital R bc we are only invoking router part of express not the whole application
const user = require("../models/user");
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });
  
router.post("/sign-up", async (req,res) => {

    const userInDatabase = await User.findOne({username: req.body.username}); //verifying whether the user exists in the database
    if(userInDatabase){  //if userindatabase exists it is just put in the if()
        return res.send("Username already taken")
    } 
    if(req.body.password !== req.body.confirmPassword){
        return res.send("Password and Confirmed Password must match")
    }

    //After the above steps are done, Now you must Register the User. To create password you first have to encrypt it
    //for encryption there is a library called bcrypt, which we must first install: npm i bcrypt
    //Bcrypt for password encryption 
    const hashedPassword = bcrypt.hashSync(req.body.password, 10); //10 is number of rounds ie Salt
    req.body.password = hashedPassword;  //we are assigning it back to the password

    //now what is left to save the record/user
    //Save/Create the User
    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`);

})

router.get("/sign-in", (req,res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req,res) => {
//template try catch for handling error on server side 
    try{ //previously was below but here this is our main functionality now put in the try{}
        const userInDatabase = await User.findOne({ username: req.body.username});//checking if user exists in database first
        if(!userInDatabase){
            return res.send("Login failed. Please try again")
        }
    
        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
        if(!validPassword){
            return res.send("login failed. Please try again")
        }
    
        //Log the user in: to log them in we need a session which requires a new library(to store data)
        // npm i express-session
        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        };
        req.session.message = "User logged in successfully";
        res.redirect("/");
        
    }catch(err){
        console.log(err)
        req.session.message = "Please try again later"; //we are now storing this message to the user 
    }

});

router.get("/sign-out", (req,res) =>{
    req.session.destroy();
    res.redirect("/");
})

module.exports = router;