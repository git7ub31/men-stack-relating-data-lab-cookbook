const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const isSignedIn = require("./middleware/is-signed-in");
const passUserToView = require("./middleware/pass-user-to-view") 

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", ()=> {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
});

// middleware section
app.use(express.urlencoded({ extended: false})); 
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,  
        saveUninitialized: true
    })
);

app.use((req, res, next) => {
    if(req.session.message){
        console.log("req.session.message", req.session.message);
        res.locals.message = req.session.message;
        req.session.message = null;
    }else{
        res.locals.message = null;
    }
    next();
})

//Require Controller
const authController = require('./controllers/auth.js');
const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');

//Use Controllers
app.use(passUserToView);
app.use('/auth', authController);  
// app.use(isSignedIn);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);

app.listen(port, ()=>{
    console.log(`The express app is ready on port ${port}`);
});

//Landing Page
app.get("/", async(req,res) => {
    res.render("index.ejs");  
});

