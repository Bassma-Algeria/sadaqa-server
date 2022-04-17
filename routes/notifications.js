const router = require("express").Router();

// middlewares
const { auth } = require("../middlewares/auth");

// handlers
const {
  getAuthUserNotifications,
} = require("../controllers/notifications/getAuthUserNotifications");
const {
  makeNotificationsRead,
  makeNotificationRead,
} = require("../controllers/notifications/makeNotificationsRead");

router.get("/getAuthUserNotifications", auth, getAuthUserNotifications);
router.put("/makeNotificationsRead", auth, makeNotificationsRead);
router.put("/makeNotificationRead/:notificationId", auth, makeNotificationRead);

module.exports = router;
