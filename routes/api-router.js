
const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();


const userDao = require("../modules/user-dao.js");

router.post("/api/login", async function (req, res) {

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
        res.status(204).end();  // Return a 204 status code
        
    } else {
        // Auth fail - return a 401 status code.
        res.status(401).end();
       
    }
});

router.get("/api/logout", function (req, res) {
    res.clearCookie("authToken");
    res.status(204).end();
});


router.get("/api/users", async function (req, res) {
    console.log("get users");
    if(!res.locals.user) {
        res.status(401).end();
    } else {
        const user = res.locals.user;
        if(!user.is_admin) {
            res.status(401).end();
           
        } else {
            const users = await userDao.retrieveAllUsers();
            res.json(users);
        }
        
    }

});


router.delete('/api/user/:id', async function(req, res) {
    const user = res.locals.user;
    const userId = req.params.id;
    if (user && user.is_admin) {
        try {
            // Delete the user and all his/her articles and comments
            await userDao.deleteUser(userId);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    } else {
        res.status(401).end();
    }
});


module.exports = router;
