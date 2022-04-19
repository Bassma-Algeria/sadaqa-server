const express = require("express");
const router = express.Router();

// middlewares
const { auth } = require("../middlewares/auth");

// handlers
const { postMessage } = require("../controllers/messages/postMessage");
const {
  getContactsList,
  getContactToAddInContactsList,
} = require("../controllers/messages/getContactsList");
const {
  getConversation,
  getOldMessages,
} = require("../controllers/messages/getConversation");
const {
  makeMessagesRead,
} = require("../controllers/messages/makeMessagesRead");
const {
  searchForContacts,
} = require("../controllers/messages/searchForContacts");

router.post("/sendMessage", auth, postMessage);
router.get("/getContacts", auth, getContactsList);
router.get("/searchForContacts/:searchTerm", auth, searchForContacts);
router.get(
  "/getContactToAddInContactsList/:contactId",
  auth,
  getContactToAddInContactsList
);
router.get("/getConversation/:chatParticipantId", auth, getConversation);
router.get("/getOldMessages/:chatParticipantId", auth, getOldMessages);
router.put("/makeMessagesRead/:chatParticipantId", auth, makeMessagesRead);

module.exports = router;
