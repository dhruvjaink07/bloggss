const express = require("express");
const router = express.Router();
const blogController = require("./../controllers/blogController");
const isAuthenticated = require("./../middleware/auth")
const upload = require('./../middleware/fileUpload');

router.route("/").get(isAuthenticated,blogController.getBlogs).post(isAuthenticated,upload.single('image'),blogController.createBlog);

router
  .route("/:id")
  .get(isAuthenticated,blogController.getBlogById)
  .patch(isAuthenticated,blogController.updateBlog)
  .delete(isAuthenticated,blogController.deleteBlog);
module.exports = router;
