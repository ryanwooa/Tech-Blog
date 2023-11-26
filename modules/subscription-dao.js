const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createSubscription(from_id, to_id) {
    const db = await dbPromise;
    const result = await db.run(SQL`INSERT INTO subscription (from_id, to_id, datetime) VALUES (${from_id}, ${to_id}, datetime("now","localtime"))`);
    return result;
}


async function deleteSubscription(from_id, to_id) {
    const db = await dbPromise;

    const query = SQL`
        DELETE FROM subscription
        WHERE from_id = ${from_id} AND to_id = ${to_id}
    `;

    await db.run(query);
}

async function isSubscribed(from_id, to_id) {
    const db = await dbPromise;

    const query = SQL`
        SELECT * FROM subscription
        WHERE from_id = ${from_id} AND to_id = ${to_id}
        
    `;
    const subscription = await db.get(query);
    return subscription !== undefined;
}


// display subscribers

async function getSubscribers(to_id) {
    const db = await dbPromise;

    const query = SQL`
        SELECT users.user_id, users.username, avatar.file_url as avatar_url, subscription.datetime, subscription.to_id FROM users
        JOIN subscription ON users.user_id = subscription.from_id
        LEFT JOIN avatar ON users.avatar_id = avatar.id 
        WHERE subscription.to_id = ${to_id}
    `;

    const subscribers = await db.all(query);
    return subscribers;
}
// display subscriptions
async function getSubscriptions(from_id) {
    const db = await dbPromise;

    const query = SQL`
        SELECT users.user_id, users.username, avatar.file_url as avatar_url, subscription.datetime, subscription.from_id FROM users
        JOIN subscription ON users.user_id = subscription.to_id
        LEFT JOIN avatar ON users.avatar_id = avatar.id 
        WHERE subscription.from_id = ${from_id}
    `;

    const subscriptions = await db.all(query);
    return subscriptions;
}

// remove subscribers
async function removeSubscriber(userId, subscriberId) {
    const db = await dbPromise;

    const query = SQL`
        DELETE FROM subscription
        WHERE from_id = ${subscriberId}
        AND to_id = ${userId}
    `;

    await db.run(query);
}
//remove subscriptions
async function unsubscribe(userId, subscriptionId) {
    const db = await dbPromise;

    const query = SQL`
        DELETE FROM subscription
        WHERE from_id = ${userId}
        AND to_id = ${subscriptionId}
    `;

    await db.run(query);
}




module.exports = {
    createSubscription,
    deleteSubscription,
    isSubscribed,
    getSubscribers,
    getSubscriptions,
    removeSubscriber,
    unsubscribe
};