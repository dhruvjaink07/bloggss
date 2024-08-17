const User = require("../models/userModel");
const Blog = require("./../models/blogModel");

exports.getBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find().populate('authorId', 'name email');
    if (allBlogs) {
      res.status(200).send({
        status: "success",
        results: allBlogs.length,
        data: {
          allBlogs,
        },
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Tour Not Found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error,
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id).populate('authorId','name email');

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error,
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    // Checking from the authenticated user id using jwt 
    req.body.authorId = req.user.id;

    if(req.file){
      req.body.image = req.file.filename;
    }
    const newBlog = await Blog.create(req.body);

    // Also We can add the blog id to the user document
    await User.findByIdAndUpdate(req.user.id, {$push:{blogs: newBlog._id}});
    res.status(201).json({
      status: "success",
      newBlog,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: {
        updatedBlog,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    await Blog.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error,
    });
  }
};
