const express = require("express");
const router = express.Router();
const multer = require("multer");

// middlewares
const { auth } = require("../middlewares/auth");
const upload = multer({ dest: "uploads/" });

// handlers
const { createPost } = require("../controllers/posts/createPost");
const { deletePost } = require("../controllers/posts/deletePost");
const { getPost } = require("../controllers/posts/getPost");
const { getPostsIds, getPosts } = require("../controllers/posts/getPosts");
const { likeUnlikePost } = require("../controllers/posts/likePost");
const { makePostInactive } = require("../controllers/posts/makePostInactive");
const { sharePost } = require("../controllers/posts/sharePost");
const { searchForPosts } = require("../controllers/posts/searchForPost");
const { getNumOfPosts } = require("../controllers/posts/getNumOfPosts");
const {
  getNumOfPostsOfAuthUser,
} = require("../controllers/posts/getNumOfPostOfAuthUser");

router.get("/", getPosts);
router.get("/getPost/:postId", getPost);
router.get("/getPostsIds", getPostsIds);
router.get("/numOfPosts", getNumOfPosts);
router.get("/getNumOfPostsOfAuthUser", getNumOfPostsOfAuthUser);
router.post("/createPost", auth, upload.array("postPhotos", 12), createPost);
router.get("/search/:searchPhrase", searchForPosts);
router.put("/likePost/:postId", auth, likeUnlikePost);
router.put("/sharePost/:postId", auth, sharePost);
router.put("/makeInactive/:postId", auth, makePostInactive);
router.delete("/deletePost/:postId", auth, deletePost);

module.exports = router;
