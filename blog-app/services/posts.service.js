const Post = require("../models/post");
const User = require("../models/user");
const Category = require("../models/category");
const async = require("async");

const getPosts = async (query, cb) => {
  const searchQuery = query.userId ? { author: query.userId } : {};
  await Post.find(searchQuery)
    .sort([["title"]])
    .exec(function (err, posts) {
      if (err) {
        err.status = 500;
        return cb(err);
      }
      return cb(posts);
    });
};

const addPost = async (params, cb) => {
  async.waterfall(
    [
      function (callback) {
        User.findOne({ username: params.author }, function (err, user) {
          if (user == null) {
            err = new Error("User not found");
            err.status = 404;
            callback(err, null);
          } else {
            callback(null, user.id);
          }
        });
      },
      function (userId, callback) {
        Category.findOne({ name: params.category }, function (err, category) {
          if (category == null) {
            err = new Error("Category not found");
            err.status = 404;
            callback(err, null);
          } else {
            callback(null, userId, category.id);
          }
        });
      },
      function (userId, categoryId, callback) {
        const post = new Post({
          title: params.title,
          description: params.description,
          author: userId,
          category: categoryId,
        });

        post.save((err, post) => {
          if (err) {
            err.status = 500;
            callback(err, null);
          } else {
            callback(null, post);
          }
        });
      },
    ],
    function (err, post) {
      if (err) {
        return cb(err);
      }

      return cb(post);
    }
  );
};

const getPost = (postId, cb) => {
  Post.findById(postId)
    .populate("author")
    .exec(function (err, post) {
      if (post === null) {
        err = new Error("Post not found");
        err.status = 404;
      }

      if (err) {
        return cb(err);
      }

      return cb(post);
    });
};

const deletePost = (postId, cb) => {
  Post.findByIdAndRemove(postId).exec(function (err, post) {
    if (post === null) {
      err = new Error("Post not found");
      err.status = 404;
    }

    if (err) {
      return cb(err);
    }

    return cb(post);
  });
};

const updatePost = (postId, body, cb) => {
  async.waterfall(
    [
      function (callback) {
        Post.findById(postId, function (err, post) {
          if (post == null) {
            err = new Error("Post not found");
            err.status = 404;
            callback(err, null);
          } else {
            callback(null, post);
          }
        });
      },
      function (post, callback) {
        const updatedPost = new Post({
          title: body.title,
          description: body.description,
          author: post.author,
          category: post.category,
          _id: postId,
        });

        Post.findByIdAndUpdate(postId, updatedPost, {}, (err) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, updatedPost);
          }
        });
      },
    ],
    function (err, newpost) {
      if (err) {
        return cb(err);
      }

      return cb(newpost);
    }
  );
};

module.exports = {
  getPosts,
  addPost,
  getPost,
  deletePost,
  updatePost,
};
