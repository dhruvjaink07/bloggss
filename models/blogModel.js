const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A Title in blog is required"],
    unique: [true, "Title Must be unique to be able to distinguished"],
  },
  summary: {
    type: String,
    required: [true, "A summary in blog is required"],
  },
  tags: [String],
  // author: {
  //   type: Object,
  //   required: [true, "Author name is required"],
  // },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image:[String],
  ratingsCount: {
    type: Number,
    default: 0,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  authorId:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A blog must have an author']
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
