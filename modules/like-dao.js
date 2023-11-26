const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getLikeCountByArticleId(articleId) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        SELECT COUNT(*) as count FROM like_article WHERE article_id = ${articleId}
    `);
    return result.count;
}

async function userHasLikedArticle(userId, articleId) {
    const db = await dbPromise;
    const result = await db.get(SQL`
        SELECT COUNT(*) as count FROM like_article WHERE article_id = ${articleId} AND user_id = ${userId}
    `);
    return result.count > 0;
}

async function addLike(userId, articleId) {
    const db = await dbPromise;
    await db.run(SQL`
        INSERT INTO like_article (user_id, article_id, datetime) VALUES (${userId}, ${articleId}, datetime("now","localtime"))
    `);
}

async function removeLike(userId, articleId) {
    const db = await dbPromise;
    await db.run(SQL`
        DELETE FROM like_article WHERE user_id = ${userId} AND article_id = ${articleId}
    `);
}


//show liked articles in personal page
async function getLikedArticlesInPersonalPage(userId) {
    const db = await dbPromise;
    const result = await db.all(SQL`
        select 
        a.*,
        b.username username,
        e.file_url as avatar_url,
        c.comment_cnt as comment_cnt, 
        d.like_cnt likes

        from articles a
        left join like_article f
        on a.id = f.article_id
        left join users b
        on a.user_id = b.user_id
        left join avatar e
        on b.avatar_id = e.id
        left join 
        (
            select 
                article_id id ,
                count(id) as comment_cnt
            from comments 
            group by article_id
        ) c
        on a.id = c.id
        left join (
            select 
                article_id id ,
                count(id) as like_cnt
            from  like_article 
            group by article_id
        ) d
        on a.id = d.id
        where f.user_id =  ${userId}

        order by f.datetime desc
    `);
    return result;
}


async function getLikedArticlesByUserId(userId) {
    const db = await dbPromise;
    const result = await db.all(SQL`
    select 
        a.*,
        b.username ,
        f.title,
        e.file_url as avatar_url
    from like_article a
    left join articles f
    on a.article_id = f.id
    left join users b
    on a.user_id = b.user_id
    left join avatar e
    on b.avatar_id = e.id
    where f.user_id =  ${userId}
    order by a.datetime desc
    `);
    return result;
}



module.exports = {
    getLikeCountByArticleId,
    userHasLikedArticle,
    addLike,
    removeLike, 
    getLikedArticlesByUserId,
    getLikedArticlesInPersonalPage
    
};
