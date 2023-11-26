const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require('fs');

const articleDao = require("../modules/article-dao.js");
const likeDao = require("../modules/like-dao.js");
const subscriptionDao = require("../modules/subscription-dao.js");
const notifyDao = require("../modules/notification-dao.js");

//multer
const multer = require('multer');
var upload = multer({
     dest: path.join(__dirname, '../public/images/upload-files'),
 });

upload = multer({
    dest: path.join(__dirname, '../public/images/upload-files-tmp'),
});


//verify user is authenticated
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { copySync } = require("fs-extra");

//open article editor to create new article
router.get("/article_editor", verifyAuthenticated ,  function (req, res) {
    res.locals.content = '<p></p>';
    res.render("editor");
});


//edit certain article
router.get("/article_editor/:id", verifyAuthenticated , async function (req, res) {
    const article_id = req.params.id;
    const article = await articleDao.retrieveArticleById(article_id);
    if(article.user_id != res.locals.user.user_id){
        res.redirect("/articles/" + article_id);
    }

    res.locals.title = article.title;
    res.locals.content = article.content;
    res.locals.status = 1;
    res.locals.article_id = article_id;
    res.render("editor");
});


//open article page
router.get("/articles/:id" , async function (req, res) {

    const article_id = req.params.id;
    let article = null;
    try {
        article = await articleDao.retrieveArticleById(article_id);
    
    } catch (error) {
        console.log(error);
        res.redirect("/");
        return
    }

    if  (article== null) {
        res.redirect("/");
         return;
    }

    var user_id = null;
    var canDelete = null;
    if (res.locals.user) {
        user_id = res.locals.user.user_id;
        canDelete = (user_id === article.user_id) || res.locals.user.is_admin; 
        res.locals.canDelete = canDelete;
    }
   
    const userHasLiked = await likeDao.userHasLikedArticle(user_id, article_id);
    const likesCount = await likeDao.getLikeCountByArticleId(article_id);
    //const authorId = await articleDao.retrieveArticleByUserId(user_id);

    res.locals.article = article;
    res.locals.title = article.title;
    res.locals.content = article.content;
    res.locals.datetime = article.datetime;
    res.locals.author = article.author;
    res.locals.authorId = article.user_id;
    res.locals.likes = likesCount;
    res.locals.userHasLiked = userHasLiked;
    res.locals.id = article_id;
    res.render("article");
});

// like article
router.post("/articles/:id/like", verifyAuthenticated , async function (req, res) {
    const userId = res.locals.user.user_id;
    const articleId = req.params.id;

    if (!await likeDao.userHasLikedArticle(userId, articleId)) {
        await likeDao.addLike(userId, articleId);
    }
    const likesCount = await likeDao.getLikeCountByArticleId(articleId);
    res.json({likesCount});

    //send notification to author
    const article = await articleDao.retrieveArticleById(articleId);
    if(article.user_id != res.locals.user.user_id){
        await notifyDao.createnewNotification(res.locals.user.user_id, article.user_id , "like", articleId);
    }

});





// unlike article
router.post("/articles/:id/unlike", verifyAuthenticated , async function (req, res) {
    const userId = res.locals.user.user_id;
    const articleId = req.params.id;

    if (await likeDao.userHasLikedArticle(userId, articleId)) {
        await likeDao.removeLike(userId, articleId);
    }
    const likesCount = await likeDao.getLikeCountByArticleId(articleId);
    res.json({likesCount});
});


//submit article and save to database
router.post("/submit_article", verifyAuthenticated , async function (req, res) {
    const {title, content, cover_url} = req.body;
   
    const article = {
        user_id: res.locals.user.user_id,
        title: title,
        content: content,
        cover_url: cover_url
    };

    var result = null;
    try {
        result = await articleDao.createArticle(article);
    } catch (error) {
        console.log(error);
    };

    if(result == null){
        res.json({status: 0 ,message: "failed"});
        return;
    }

    res.json({status: 1 ,message: "got it", article_id: result});

    //notify all subscribers
    const subscribers = await subscriptionDao.getSubscribers(res.locals.user.user_id);
    subscribers.forEach(async (subscriber) => {
        await notifyDao.createnewNotification(res.locals.user.user_id, subscriber.user_id, "article" , result);
    });

});


//update article and save to database
router.post("/update_article", verifyAuthenticated , async function (req, res) {
    const {title, content, articleId, cover_url } = req.body;
   
    const article = {
        user_id: res.locals.user.user_id,
        title: title,
        content: content,
        id : articleId,
        cover_url: cover_url

    };

    var result = null;
    try {
        result = await articleDao.updateArticleById(article);
    } catch (error) {
        console.log(error);
    };

    if(result == null){
        res.json({status: 0 ,message: "failed"});
        return;
    }
    res.json({status: 1 ,message: "got it", article_id: result});
});


// upload image while editing article
router.post('/api/upload-img', upload.single('custom-fileName'),  function (req, res) {
    
    const fileInfos = req.file;
    const oldName = fileInfos.path;
    const otherName = genRandomFileName(fileInfos.originalname);
    const newName = `./public/images/upload-files/${otherName}`;
    fs.renameSync(oldName, newName);

    const url = `http://127.0.0.1:3000//images/upload-files/${otherName}`

    const data = { 
        errno: 0, 
        data: {
            url: url, 
        }
    };
    res.json(data);
});


router.delete("/articles/:id", verifyAuthenticated, async function(req, res) {
    const articleId = req.params.id;
    try {
        // Delete the article and all its associated comments
        await articleDao.deleteArticleById(articleId);
        res.status(200).send({ message: 'Article and associated comments deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'There was a problem trying to delete the article' });
    }
});

///sort by date
router.get("/sortByTimeAsc" , async function (req, res) {
    const article = await articleDao.retrieveAllArticlesSortByTimeAsc();
    res.json(article);
});

///sort by date
router.get("/sortByTimeDesc" , async function (req, res) {
    const article = await articleDao.retrieveAllArticles();
    res.json(article);
});


///sort by username
router.get("/sortByUsernameAsc" , async function (req, res) {
    const article = await articleDao.retrieveAllArticlesSortByUsernameAsc();
    res.json(article);
});

///sort by date
router.get("/sortByUsernameDesc" , async function (req, res) {
    const article = await articleDao.retrieveAllArticlesSortByUsernameDesc();
    res.json(article);
});

///sort by title
router.get("/sortByTitleAsc" , async function (req, res) {
    const article = await articleDao.retrieveAllArticlesSortByTitleAsc();
    res.json(article);
});

///sort by title
router.get("/sortByTitleDesc" , async function (req, res) {
    const article = await articleDao.retrieveAllArticlesSortByTitleDesc();
    res.json(article);
});



//// for upload image
function getRandom() {
    return Math.random().toString(36).slice(-3)
};

/**
 * add additional name for the file，like a.png transfer to a-123123.png
 * @param {string} fileName 
 */
function genRandomFileName(fileName = '') {
   
    const r = getRandom()
    if (!fileName) return r

    const length = fileName.length 
    const pointLastIndexOf = fileName.lastIndexOf('.') 
    if (pointLastIndexOf < 0) return `${fileName}-${r}`

    const fileNameWithOutExt = fileName.slice(0, pointLastIndexOf) 
    const ext = fileName.slice(pointLastIndexOf + 1, length) 
    return `${fileNameWithOutExt}-${r}.${ext}`
};






//export this router 
module.exports = router

