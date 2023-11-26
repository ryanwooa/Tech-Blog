const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//create comment
async function createComment(comment) {
    const db = await dbPromise;
    const result = await db.run(SQL`
        INSERT INTO comments (user_id, article_id, content, parent_id, datetime)
        VALUES (${comment.user_id}, ${comment.article_id}, ${comment.content}, ${comment.parent_id}, datetime("now","localtime"))
    `);

    return 1;
};

//retrieve comments by article id
async function retrieveCommentsByArticleId(article_id) {
    const db = await dbPromise;
    const comments = await db.all(SQL`
        SELECT a.*, b.username, c.file_url as avatar_url
        FROM comments a 
        left join 
        users b 
        on a.user_id = b.user_id 
        left join avatar c
        on b.avatar_id = c.id
        WHERE a.article_id = ${article_id}
    `);
    return comments;
}


// Delete a comment and all its children
async function deleteCommentAndChildren(commentId) {
    const db = await dbPromise;
    
    // Retrieve the child comments
    const childComments = await db.all(SQL`SELECT id FROM comments WHERE parent_id = ${commentId}`);
    
    // Recursively delete each child comment
    for (let comment of childComments) {
        await deleteCommentAndChildren(comment.id);
    }

    // Delete the comment itself
    await db.run(SQL`DELETE FROM comments WHERE id = ${commentId}`);

}

async function retrieveCommentById(id) {
    const db = await dbPromise;
    const comment = await db.get(SQL`
        SELECT * FROM comments
        WHERE id = ${id}
    `);
    return comment;
}

async function retrieveCommentByUserId(user_id) {
    const db = await dbPromise;
    const comment = await db.all(SQL`
    select 
    c.*, d.username, e.file_url as avatar_url
    from users a
    left join articles b
    on a.user_id = b.user_id
    left join comments c
    on b.id = c.article_id
    left join users d
    on c.user_id = d.user_id
    left join avatar e
    on d.avatar_id = e.id
    where a.user_id = ${user_id}
    and c.id is not null
   
    `);
    return comment;
}


//export
module.exports = {
    createComment,
    retrieveCommentsByArticleId,
    deleteCommentAndChildren,
    retrieveCommentById,
    retrieveCommentByUserId
};

