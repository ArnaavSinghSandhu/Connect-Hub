const { Router } = require("express");
const passport = require('passport');
const authRouter = Router();
const prisma = require('../db');

authRouter.get('/login', (req, res) => res.render('login'));

authRouter.post('/login', passport.authenticate('local', {
    successRedirect: "/posts",
    failureRedirect: "/auth/login", 
}));


authRouter.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

authRouter.get("/signup", (req,res) => res.render("signup"));

authRouter.post("/signup", async (req,res,next) => {
    try{
        await prisma.user.create({
            data:{
                username: req.body.username,
                password: req.body.password,
            },
        });
        res.redirect("/auth/login");
    }catch(err){
        next(err);
    }
})
module.exports = authRouter;