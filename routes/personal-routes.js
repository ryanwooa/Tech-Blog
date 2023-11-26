const express = require("express");
const router = express.Router();
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const articleDao = require("../modules/article-dao.js");
const analyticsDao = require("../modules/analytics-dao.js");


const likeDao = require("../modules/like-dao.js");
const notifyDao = require("../modules/notification-dao.js");
const subscriptionDao = require("../modules/subscription-dao.js");
const userDao = require("../modules/user-dao.js");



// Analytics route
router.get("/analytics", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    let totalFollowers = await analyticsDao.getTotalFollower(user.user_id);
    let totalComments = await analyticsDao.getTotalComment(user.user_id);
    let totalLikes = await analyticsDao.getTotalLike(user.user_id);
    let top3PopularArticles = await analyticsDao.getTop3PopularArticles(user.user_id);
    let userInfo = await analyticsDao.getUserInfo(user.user_id);

    res.render("analytics", {
        user: user,
        totalFollowers: totalFollowers,
        totalComments: totalComments,
        totalLikes: totalLikes,
        top3PopularArticles: top3PopularArticles,
        gender:userInfo.gender,
        date_of_birth:userInfo.date_of_birth,
        country:userInfo.country
    });
});

// Route for date range comments
router.get("/api/comments-count", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    let startDate = req.query['startDate'] || new Date().toISOString().slice(0, 10);
    let endDate = req.query['endDate'] || new Date().toISOString().slice(0, 10);

    let dailyCommentCounts = await analyticsDao.getDailyCommentCounts(user.user_id, startDate, endDate);
    const dateList = dailyCommentCounts.map(item => item.date);
    const commentCounts = dailyCommentCounts.map(item => item.comments);
    res.json({ dateList, commentCounts });
});


// Notification history route
router.get("/notification-history", verifyAuthenticated, async function (req, res) {
    const results = await notifyDao.retrieveAllNotificationByUserId(res.locals.user.user_id);
    res.locals.notifications = results;
    res.render("notification-history");
});


// Whenever we navigate to /home, verify that we're authenticated. If we are, render the home view.
router.get("/account/:id", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const page_user_id = req.params.id;
    const subscribers = await subscriptionDao.getSubscribers(page_user_id);
    const subscriptions = await subscriptionDao.getSubscriptions(page_user_id);
    const totalFollowers = await analyticsDao.getTotalFollower(page_user_id);
    const totalComments = await analyticsDao.getTotalComment(page_user_id);
    const totalLikes = await analyticsDao.getTotalLike(page_user_id);
    const likedArticles = await likeDao.getLikedArticlesInPersonalPage(page_user_id);
    const articles = await articleDao.retrieveArticleByUserId(page_user_id);
    const avatar = await userDao.retrieveUserById(page_user_id);
    let page_user = await userDao.retrieveUserById(page_user_id);
    const isMyAccount = user.user_id == page_user_id;
    const timestamp = Date.now();


    if  (!page_user) {
        // res.status(404).send({ message: `User with id ${page_user_id} not found` });
        res.redirect("/");
    }

    let canDeleteUser; 
    if (page_user_id == user.user_id) {
        canDeleteUser = true;
    } else {
        canDeleteUser = false;
    }
    res.locals.canDeleteUser = canDeleteUser;
    res.render("account", { timestamp,articles, user, page_user, subscribers, subscriptions, totalFollowers, totalComments, totalLikes, likedArticles,isMyAccount, avatar });
});




router.get("/likes/:id", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;

    const page_user_id = req.params.id;
    let page_user = await userDao.retrieveUserById(page_user_id);


    let isMyAccount = false;; 
    if (page_user_id == user.user_id) {
        isMyAccount = true;
    } else {
        isMyAccount = false;
    }
    res.locals.isMyAccount = isMyAccount;

    res.locals.page_user = page_user;
    const articles = await likeDao.getLikedArticlesByUserId(page_user_id);
    res.render("likes", {articles});
});


// display all subscribers
// display all subscriptions

router.get("/subscriptions/:id", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    

    const page_user_id = req.params.id;
    const subscribers = await subscriptionDao.getSubscribers(page_user_id);
    const subscriptions = await subscriptionDao.getSubscriptions(page_user_id);
    let page_user = await userDao.retrieveUserById(page_user_id);


    let isMyAccount = false;; 
    if (page_user_id == user.user_id) {
        isMyAccount = true;
    } else {
        isMyAccount = false;
    }
    res.locals.isMyAccount = isMyAccount;

    res.locals.page_user = page_user;
    res.locals.page_user_id = page_user_id;
    res.locals.subscribers = subscribers;
    res.locals.subscriptions = subscriptions;
    res.render("subscriptions");
});



// unsubscribe
router.post("/unsubscribe", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const toUserId = req.body.toUserId;
    const userid = req.body.userid;

    await subscriptionDao.unsubscribe(user.user_id, toUserId);
    res.redirect("/subscriptions/" + userid);

});

// remove subscriber
router.post("/remove-subscriber", verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const fromUserId = req.body.fromUserId;
    const userid = req.body.userid;


    await subscriptionDao.removeSubscriber(user.user_id, fromUserId);
    res.redirect(`/subscriptions/${userid}`);

});



router.delete('/user/:id', verifyAuthenticated, async function(req, res) {
    const userId = req.params.id;
    try {
        // Delete the user and all his/her articles and comments
        await userDao.deleteUser(userId);
        res.status(200).send({ message: 'User and his/her articles and comments deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'There was a problem trying to delete the user' });
    }
});

// Add route for editing user's details
router.get("/account/:id/edit", verifyAuthenticated, async function (req, res) {
    const page_user_id = req.params.id;
    let page_user = await userDao.retrieveUserById(page_user_id);
    switch (page_user.avatar_id) {
        case 1: res.locals.avatar1  = true; break;
        case 2: res.locals.avatar2  = true; break;
        case 3: res.locals.avatar3  = true; break;
        case 4: res.locals.avatar4  = true; break;
        case 5: res.locals.avatar5  = true; break;
        case 6: res.locals.avatar6  = true; break;
        case 7: res.locals.avatar7  = true; break;
        case 8: res.locals.avatar8  = true; break;
        case 9: res.locals.avatar9  = true; break;
        case 10: res.locals.avatar10  = true; break;
        case 11: res.locals.avatar11  = true; break;
        case 12: res.locals.avatar12  = true; break;
        case 13: res.locals.avatar13  = true; break;
        case 14: res.locals.avatar14  = true; break;
        case 15: res.locals.avatar15  = true; break;
    }

    switch (page_user.gender)   {
        case "Male": res.locals.gender1 = true; break;
        case "Female": res.locals.gender2 = true; break;
        case "Transgender": res.locals.gender3 = true; break;
        case "Non-binary/non-conforming": res.locals.gender4 = true; break;
        case "PreferNotToRespond": res.locals.gender5 = true; break;
        female
    }

    if(res.locals.user.user_id == page_user_id) {
        res.render("edit-account", { page_user });
    } else {
        res.redirect("/account/" + page_user_id);
    }
});

router.post("/account/:id/edit", verifyAuthenticated, async function (req, res) {
    const page_user_id = req.params.id;
    let page_user = await userDao.retrieveUserById(page_user_id);

    if(res.locals.user.user_id == page_user_id) {
        page_user.username = req.body.username;
        page_user.realname = req.body.fullName;
        page_user.description = req.body.description;
        page_user.gender = req.body.gender;
        page_user.date_of_birth = req.body.date;
        page_user.country = req.body.country;
        page_user.avatar = req.body.avatar;
        page_user.password = req.body.password;

        await userDao.updateUserDetails(page_user);

        res.redirect("/account/" + page_user_id);
    } else {
        res.redirect("/account/" + page_user_id);
    }
});

router.get("/users",verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;

    if(!user.is_admin) {
        res.status(401).send({ message: 'You are not authorized to access this resource' });
        res.redirect("/");
    }
    const users = await userDao.retrieveAllUsers();
    
    res.locals.users = users;
    res.render("alluser.handlebars");

});


module.exports = router;