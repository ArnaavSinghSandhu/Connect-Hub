const { Router } = require("express");
const userController = require("../controllers/userController.js");
const usersRouter = Router();


usersRouter.use("/:id/show", userController.show);
usersRouter.post("/:id/follow", userController.followUser);
usersRouter.post("/:id/unfollow",userController.unfollow);
usersRouter.use("/",userController.index);
module.exports = {usersRouter};