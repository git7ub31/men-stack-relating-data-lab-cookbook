//we used to use app.use to create middleware, now we create it separately to protect routes
//this is for signing in, it should return true
const isSignedIn = (req,res, next) => {
    if(req.session.user) return next();   //this is the if statement and line below is the else part, this is just a way of writing an if statement if there is only 2 lines of code 
    res.redirect("/auth/sign-in");
};

module.exports = isSignedIn;


//now we have to require this in out server.js file
//next is a function to pass middleware 
