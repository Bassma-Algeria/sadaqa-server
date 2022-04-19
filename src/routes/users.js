const express = require("express");
const router = express.Router();
const multer = require("multer");

// middlewars
const { auth } = require("../middlewares/auth");
const upload = multer({ dest: "uploads/" });
// handlers
const { signupUser } = require("../controllers/users/signup");
const { loginUser } = require("../controllers/users/login");
const { getUser } = require("../controllers/users/getUser");
const {
  getAuthUser,
  getNewNumOfUnreadMessages,
} = require("../controllers/users/getAuthUser");
const {
  editGeneralInfo,
  editCredentials,
} = require("../controllers/users/editUserInfo");
const {
  getAllAssociations,
  getAssociationPerWilaya,
} = require("../controllers/users/getAssociations");
const { activeAssociation } = require("../controllers/users/activeAssociation");
const { getUsersIds } = require("../controllers/users/getUsersIds");
const { setPreferences } = require("../controllers/users/setPreferences");

router.post("/login", loginUser);
router.post("/signup", upload.array("associationDocs", 12), signupUser);
router.get("/getUser/:userId", getUser);
router.get("/getAuthUser", auth, getAuthUser);
router.get("/getAllAssoctiations", getAllAssociations);
router.get("/getAssociationPerWilaya", getAssociationPerWilaya);
router.get("/getNumOfUnreadMessages", auth, getNewNumOfUnreadMessages);
router.post("/activeAssociation", activeAssociation);
router.put(
  "/editGeneralInfo",
  auth,
  upload.single("profilePic"),
  editGeneralInfo
);
router.put("/editCredentials", auth, editCredentials);
router.put("/setPreferences", auth, setPreferences);
router.get("/getUsersIds", getUsersIds);

module.exports = router;
