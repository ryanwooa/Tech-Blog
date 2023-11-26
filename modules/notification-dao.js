const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//get notification by user id include from username and from avatar url
async function retrieveAllNotificationByUserId(id) {
    const db = await dbPromise;
    const result = await db.all(SQL`
        select a.* , b.username as from_username, c.file_url as from_avatar_url, d.title as article_title
        from notification a
        left join users b
        on a.from_id = b.user_id
        left join avatar c
        on b.avatar_id = c.id
        left join articles d
        on a.article_id = d.id
        where a.to_id = ${id};
    `);
    return result;
}

//create notification by type
async function createnewNotification(from_id, to_id, type, article_id = null) {
    const db = await dbPromise;

    if (type == "like") {
        await db.all(SQL`
        INSERT INTO notification (from_id, to_id, article_id, is_like, datetime, is_read)
        VALUES (${from_id}, ${to_id}, ${article_id}, 1, datetime("now","localtime"), 0)
    `);
    } else if (type == "comment") {
        await db.all(SQL`
        INSERT INTO notification (from_id, to_id, article_id, is_comment, datetime, is_read)
        VALUES (${from_id}, ${to_id}, ${article_id}, 1, datetime("now","localtime"), 0)
    `);
    } else if (type == "subscribe") {
        await db.all(SQL`
        INSERT INTO notification (from_id, to_id, is_subscribe, datetime, is_read)
        VALUES (${from_id}, ${to_id}, 1, datetime("now","localtime"), 0)
    `);
    } else if (type == "article") {
        await db.all(SQL`
        INSERT INTO notification (from_id, to_id, article_id, is_article, datetime, is_read)
        VALUES (${from_id}, ${to_id}, ${article_id}, 1, datetime("now","localtime"), 0)
    `);
    }
};


//get number of new notifications by user id
async function retrieveNumberByUserId(id) {
    const db = await dbPromise;
    const result = await db.all(SQL`
        select 
            sum(1) cnt,
            sum(is_like) like_cnt,
            sum(is_subscribe) sub_cnt,
            sum(is_comment) comment_cnt,
            sum(is_article) article_cnt
        from notification
        where to_id = ${id}
        and is_read = 0
    `);
    return result;
}

async function retrieveUnreadNotificationsByUserId(id) {
    const db = await dbPromise;
    const result = await db.all(SQL`
        select 
           a.* , 
           b.username as from_username, 
           c.file_url as from_avatar_url, 
           d.title as article_title
        from notification a
        left join users b
        on a.from_id = b.user_id
        left join avatar c
        on b.avatar_id = c.id
        left join articles d
        on a.article_id = d.id
        where to_id = ${id}
        and is_read = 0
        order by a.datetime desc
    `);
    return result;





}
//get number of new notifications by user id
async function updateNotificationStatus(id, userid) {
    const db = await dbPromise;
    const result = await db.all(SQL`
        update notification 
        set is_read = 1 
        where id = ${id}
        and to_id = ${userid}
    `);
    return result;
}


module.exports = {
    createnewNotification,
    retrieveAllNotificationByUserId,
    retrieveNumberByUserId,
    updateNotificationStatus,
    retrieveUnreadNotificationsByUserId
};