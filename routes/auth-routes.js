const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/user-dao.js");

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view.
router.get("/login", function (req, res) {

    if (res.locals.user) {
        res.redirect("/");
    }

    else {
        res.render("login");
    }

});

// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await userDao.retrieveUserWithCredentials(username, password);



        if (user) {
            // Auth success - give that user an authToken, save the token in a cookie.
            const authToken = uuid();
            user.authToken = authToken;
            await userDao.updateUser(user);
            res.cookie("authToken", authToken);
            res.locals.user = user;
            req.session.userId = user.user_id;
            res.status(204).redirect("/");  // Return a 204 status code
            
        } else {
            // Auth fail - return a 401 status code.
            res.status(401);
            res.redirect("/login")
        }
    });
    


// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");

    res.status(204);
    res.setToastMessage("Logged out successfully!");
    res.redirect("/login");

});

// Account creation
router.get("/signup", function (req, res) {
    res.render("signup");
});


//check username availability
router.get("/checkUsername", async function (req, res) {
    const username = req.query.username;

    // If the request comes from our JavaScript code for username checking
    const existingUser = await userDao.retrieveUserByUsername(username);
    if (existingUser) {
        res.json({ isTaken: true, message: "The username is already taken." });
    } else {
        res.json({ isTaken: false, message: "The username is available." });
    }
});

router.post("/newAccount", async function (req, res) {

    const user = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.fullName,
        date: req.body.date,
        gender: req.body.gender,
        country: req.body.country,
        description: req.body.description,
        avatarID: req.body.avatar
    };


        try {
            await userDao.createUser(user);
            res.setToastMessage("Account creation successful. Please login using your new credentials.");
            res.redirect("/login");
        }
        catch (err) {
            res.setToastMessage("That username was already taken!");
            res.redirect("/signup");
        }

    });



module.exports = router;