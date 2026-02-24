const { Router } = require("express");
const postsRouter = Router();
const postController = require("../controllers/postController");

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect("/auth/login");
}

postsRouter.get("/create", ensureAuthenticated, (req,res) => {
    res.render("createpost");
} )
postsRouter.post("/", ensureAuthenticated, postController.post_create_post);
postsRouter.get("/", postController.post_list_get);

module.exports = postsRouter;