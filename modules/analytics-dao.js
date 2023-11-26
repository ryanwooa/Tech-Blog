const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getTotalFollower(userId) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        select count(id) totalFollowers
        from subscription
        where to_id = ${userId}
    `);
    if(result == undefined) {
        return 0;
    }
    return result.totalFollowers;
}

async function getTotalComment(userId) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        SELECT 
        count(a.id) as totalComments
        FROM comments a
        left join articles b
        on a.article_id = b.id
        where b.user_id = ${userId}
    `);
    if(result == undefined) {
        return 0;
    }
    return result.totalComments;
}

async function getTotalLike(userId) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        SELECT 
        count(a.id) as totalLikes
        FROM like_article a
        left join articles b
        on a.article_id = b.id
        where b.user_id = ${userId}
    `);
    if(result == undefined) {
        return 0;
    }
    return result.totalLikes;
}


async function getTop3PopularArticles(userId) {
    const db = await dbPromise;
    const articles = await db.all(SQL`SELECT id, title, datetime,cover_url FROM articles WHERE user_id = ${userId}`);
    for(let article of articles) {
        const commentsCount = await db.get(SQL`SELECT COUNT(*) as count FROM comments WHERE article_id = ${article.id}`);
        const likesCount = await db.get(SQL`SELECT COUNT(*) as count FROM like_article WHERE article_id = ${article.id}`);
        article.popularity = commentsCount.count * 2 + likesCount.count;
        article.likes = likesCount.count;
        article.comments = commentsCount.count;
        
        //article.thumbnail = (await getArticleThumbnail(article.id)).url;

    }
    articles.sort((a, b) => b.popularity - a.popularity);
    return articles.slice(0, 3);
}

async function getDailyCommentCounts(userId, startDate, endDate) {
    const db = await dbPromise;
    const dailyCommentCounts = await db.all(SQL`SELECT DATE(comments.datetime) as date, COUNT(*) as comments 
        FROM comments
        INNER JOIN articles ON comments.article_id = articles.id
         WHERE articles.user_id = ${userId} AND DATE(comments.datetime) BETWEEN ${startDate} AND ${endDate}
         GROUP BY DATE(comments.datetime)
         ORDER BY DATE(comments.datetime)`);
    // Create a map with all dates in the range and default comment count to 0
    const allDates = {};
    for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
        allDates[date.toISOString().slice(0, 10)] = 0;
    }
    // Update comment counts for dates that have comments
    dailyCommentCounts.forEach(item => {
        allDates[item.date] = item.comments;
    });
    // Convert the map to the desired output format
    const output = Object.keys(allDates).map(date => ({ date, comments: allDates[date] }));
    return output;
}

async function getUserInfo(userId) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        SELECT 
        gender,
        date_of_birth,
        country,
        avatar_id
        FROM users
        WHERE user_id = ${userId}
    `);
    return result;
}


async function getTop5PopularArticlesFromAll() {
    const db = await dbPromise;
    const articles = await db.all(SQL`
        select a.* , d.username, comment_cnt, like_cnt, like_cnt+ 2* comment_cnt as popular
        from articles a
        LEFT join (
        SELECT  
            article_id, 
            COUNT(*) as comment_cnt
        FROM comments 
        group by article_id
        )b
        on a.id = b.article_id
        left join (
            SELECT  
                article_id, 
                COUNT(*) as like_cnt
            FROM like_article 
            group by article_id
        ) c
        on a.id = c.article_id
        left join users d on a.user_id = d.user_id
        order by popular desc
        limit 5;
    `);
    
    return articles;
}



module.exports = {
    getTotalFollower,
    getTotalComment,
    getTotalLike,
    getTop3PopularArticles,
    getDailyCommentCounts,
    getUserInfo,
    getTop5PopularArticlesFromAll

};
