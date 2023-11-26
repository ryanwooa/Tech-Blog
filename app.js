// Setup Express
const express = require("express");
const app = express();
const port = 3000;
const session = require('express-session');





// Setup our database
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
// Setup Passport
const passport = require('./config/passport-config'); 

app.use(passport.initialize());
app.use(passport.session());

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");



//CORS
const cors = require('cors');
app.use(cors());


// Setup body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Setup our middleware
const { toaster } = require("./middleware/toaster-middleware.js");
app.use(toaster);

// Setup our middleware
const { addUserToLocals } = require("./middleware/auth-middleware.js"); 
app.use(addUserToLocals);

// Setup our routes
const authRouter = require("./routes/auth-routes.js");
app.use(authRouter);

const appRouter = require("./routes/application-routes.js");
app.use(appRouter);


// Use the new middleware function when registering a new user
authRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));


const articleRouter = require("./routes/article-routes.js");
app.use(articleRouter);

const commentRouter = require("./routes/comments-routes.js");
app.use(commentRouter);

const personalRouter = require("./routes/personal-routes.js");
app.use(personalRouter);



//subscribe
const subscribeRouter = require("./routes/subscription-routes.js");
app.use(subscribeRouter);


//API
const apiRouter = require("./routes/api-router.js");
app.use(apiRouter);



// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});