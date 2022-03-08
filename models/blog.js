const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const BlogSchema = new Schema({
    title: String,
    author: String,
    detail: String,
    date: String,
    image: String,
  });
  
  const Blog = mongoose.model('blog', BlogSchema);

  module.exports = Blog;
