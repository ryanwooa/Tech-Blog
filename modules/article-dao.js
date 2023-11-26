const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const commentsDao = require("./comments-dao.js");

/**
 * Retrieves all articles from the database.
 */
async function retrieveAllArticles() {
    const db = await dbPromise;
    const articles = await db.all(SQL`
    select 
        a.*,
        b.username author,
        e.file_url as avatar_url,
        c.comment_cnt as comment_cnt, 
        d.like_cnt likes
    
    from articles a
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
    order by a.datetime desc
    `);
    return articles;
}


//create article
async function createArticle(article){
    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into articles (user_id, title, datetime, content, cover_url) values
        (${article.user_id}, ${article.title}, datetime("now","localtime"), ${article.content}, ${article.cover_url})`);

    return result.lastID;
}

//get article by id
async function retrieveArticleById(id){
    const db = await dbPromise;
    const result = await db.get(SQL`
    select 
        a.*,
        b.username author,
        e.file_url as avatar_url,
        c.comment_cnt, 
        d.like_cnt likes
    
    from articles a
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
        WHERE a.id = ${id} 
    `);
    return result;
}



//get article by user_id
async function retrieveArticleByUserId(id){
    const db = await dbPromise;
    const result = await db.all(SQL`
    select 
    a.*,
    b.username author,
    e.file_url as avatar_url,
    c.comment_cnt, 
    d.like_cnt likes

from articles a
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
 where a.user_id = ${id} 
    `);
    return result;
}


//update article by 
async function updateArticleById(article){
    const db = await dbPromise;
    const result = await db.run(SQL`
    update articles 
    set title = ${article.title}, content = ${article.content}, cover_url = ${article.cover_url}, datetime = datetime("now","localtime") 
    where id = ${article.id}
  `);
   
    return article.id;
}

async function deleteArticleById(articleId) {
    const db = await dbPromise;
    // Delete comments associated with the article
    const comments = await db.all(SQL`SELECT id FROM comments WHERE article_id = ${articleId}`);
    for (let comment of comments) {
        await commentsDao.deleteCommentAndChildren(comment.id);
    }
    // Then delete the article itself
    await db.run(SQL`DELETE FROM articles WHERE id = ${articleId}`);
}

// sort all articles by datetime asc
async function retrieveAllArticlesSortByTimeAsc() {
    const db = await dbPromise;
    const articles = await db.all(SQL`
    select 
        a.*,
        b.username author,
        e.file_url as avatar_url,
        c.comment_cnt as comment_cnt, 
        d.like_cnt likes
    
    from articles a
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
    order by a.datetime 
    `);
    return articles;
}

// sort all articles by Username asc
async function retrieveAllArticlesSortByUsernameAsc() {
    const db = await dbPromise;
    const articles = await db.all(SQL`
    select 
        a.*,
        b.username author,
        e.file_url as avatar_url,
        c.comment_cnt as comment_cnt, 
        d.like_cnt likes
    
    from articles a
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
    order by upper(b.username) asc
    
    `);
    return articles;
}

// sort all articles by Username desc
async function retrieveAllArticlesSortByUsernameDesc() {
    const db = await dbPromise;
    const articles = await db.all(SQL`
    select 
        a.*,
        b.username author,
        e.file_url as avatar_url,
        c.comment_cnt as comment_cnt, 
        d.like_cnt likes
    
    from articles a
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
    order by upper(b.username) desc
    
    `);
    return articles;
}


// sort all articles by Title asc
async function retrieveAllArticlesSortByTitleAsc() {
    const db = await dbPromise;
    const articles = await db.all(SQL`
    select 
        a.*,
        b.username author,
        e.file_url as avatar_url,
        c.comment_cnt as comment_cnt, 
        d.like_cnt likes
    
    from articles a
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
    order by upper(a.title) asc
    
    `);
    return articles;
}

// sort all articles by Title desc
async function retrieveAllArticlesSortByTitleDesc() {
    const db = await dbPromise;
    const articles = await db.all(SQL`
    select 
        a.*,
        b.username author,
        e.file_url as avatar_url,
        c.comment_cnt as comment_cnt, 
        d.like_cnt likes
    
    from articles a
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
    order by upper(a.title) desc
    
    `);
    return articles;
}

//export
module.exports = {
    createArticle,
    retrieveArticleById,
    retrieveAllArticles,
    updateArticleById,
    retrieveArticleByUserId,
    deleteArticleById,
    retrieveAllArticlesSortByTimeAsc,
    retrieveAllArticlesSortByUsernameAsc,
    retrieveAllArticlesSortByUsernameDesc,
    retrieveAllArticlesSortByTitleAsc,
    retrieveAllArticlesSortByTitleDesc


};

