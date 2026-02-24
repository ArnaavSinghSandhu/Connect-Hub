const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/messageController");

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).send("Unauthorized");
};

messageRouter.get("/:userId", ensureAuthenticated, messageController.getChatHistory);

module.exports = messageRouter;