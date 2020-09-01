const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const postController = require("../controllers/post");

const router = express.Router();

//add multer middleware with storage config to extract single file from the incoming request
router.post("", checkAuth, extractFile, postController.createPost);

router.put("/:id", checkAuth, extractFile, postController.updatePost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPost);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
