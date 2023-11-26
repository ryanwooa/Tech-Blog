const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const subscriptionDao = require("../modules/subscription-dao.js");
const notifyDao = require("../modules/notification-dao.js");

//subscribe user
router.post("/subscribe/:id", verifyAuthenticated, async function (req, res) {
    const from_id = res.locals.user.user_id;
    const to_id = req.params.id;

    try {
        await subscriptionDao.createSubscription(from_id, to_id);
        res.json({status: 1, message: "Subscribed successfully"});
        await notifyDao.createnewNotification(from_id, to_id, "subscribe");

    } catch (error) {
        res.json({status: 0, message: "Subscription failed"});
    }
});

router.delete("/subscribe/:id", verifyAuthenticated, async function (req, res) {
    const from_id = res.locals.user.user_id;
    const to_id = req.params.id;

    try {
        await subscriptionDao.deleteSubscription(from_id, to_id);
        res.json({status: 1, message: "Unsubscribed successfully"});
    } catch (error) {
        res.json({status: 0, message: "Unsubscription failed"});
    }
});

router.get("/isSubscribed/:id", verifyAuthenticated, async function (req, res) {
    const from_id = res.locals.user.user_id;
    const to_id = req.params.id;

    try {
        const isSubscribed = await subscriptionDao.isSubscribed(from_id, to_id);
        res.json({status: isSubscribed ? 1 : 0, message: isSubscribed ? "Already subscribed" : "Not yet subscribed"});
    } catch (error) {
        res.json({status: 0, message: "Check subscription failed"});
    }
});



module.exports = router;