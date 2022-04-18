const router = require("express").Router();

const globalRoutes = require("./global");
const userRoutes = require("./users");
const adsRoutes = require("./posts");
const messagesRoutes = require("./messages");
const notificationsRoutes = require("./notifications");
const visitsRoutes = require("./visits");

router.use("/", globalRoutes);
router.use("/users", userRoutes);
router.use("/posts", adsRoutes);
router.use("/messages", messagesRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/visits", visitsRoutes);

module.exports = router;
