const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

const commentsDao = require("../modules/comments-dao.js");
const { route } = require("./article-routes.js");
const notifyDao = require("../modules/notification-dao.js");
const articleDao = require("../modules/article-dao.js");
const userDao = require("../modules/user-dao.js");


//submit comment and save to database  then refresh the page
router.post("/articles/submit_comment", verifyAuthenticated, async function (req, res) {
    const comment = req.body.comment;
    const article_id = req.body.hidden_article_id;
    const parent_id = req.body.hidden_parent_id;
    const data = {
        user_id: res.locals.user.user_id,
        article_id: article_id,
        content: comment,
        parent_id: parent_id
    };
    
    await commentsDao.createComment(data);

    //send notification to author
    const article = await articleDao.retrieveArticleById(article_id);
    if(article.user_id != res.locals.user.user_id){
        await notifyDao.createnewNotification(res.locals.user.user_id, article.user_id , "comment", article_id);
    }

    if(parent_id ){
        const parent_comment = await commentsDao.retrieveCommentById(parent_id);
        if(parent_comment.user_id != res.locals.user.user_id){
            await notifyDao.createnewNotification(res.locals.user.user_id, parent_comment.user_id , "comment", article_id);
        }
    }
    res.redirect("/articles/" + article_id);
});


router.get("/comments", async function(req,res){
    
    const id = req.query.id;
    const data = await commentsDao.retrieveCommentsByArticleId(id);
    const article = await articleDao.retrieveArticleById(id);

    if(res.locals.user){
        const user_id = res.locals.user.user_id; 
        data.forEach(comment => {
            if(comment.user_id == user_id){
                comment.canDelete = true;
            }else if (user_id == article.user_id){
                comment.canDelete = true;
            }else if (res.locals.user.is_admin){
                comment.canDelete = true;
            }
        });
    }

    res.json(data);
});



router.delete("/comments/:id", verifyAuthenticated, async function (req, res) {
    const commentId = req.params.id;

    try {
        // Delete the comment and all its children
        await commentsDao.deleteCommentAndChildren(commentId);
        res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'There was a problem trying to delete the comment' });
    }
});

router.get("/comments/:id", async function(req,res){
    const user = res.locals.user;
    const page_user_id = req.params.id;  

    let page_user = await userDao.retrieveUserById(page_user_id);

    const comments = await commentsDao.retrieveCommentByUserId(page_user_id);
    let isMyAccount = false;; 
    if (page_user_id == user.user_id) {
        isMyAccount = true;
    } else {
        isMyAccount = false;
    }
    res.locals.isMyAccount = isMyAccount;

    res.locals.page_user = page_user;
    res.locals.comments = comments;
    res.render("comments", )
});



module.exports = router;
