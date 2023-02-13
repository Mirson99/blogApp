const {
  getPosts,
  addPost,
  getPost,
  deletePost,
  updatePost,
} = require("../services/posts.service");
const {
  createPostValidationRules,
  singlePostValidationRules,
  updatePostValidationRules,
  validate,
} = require("../middleware/postValidator");

const verifyJWT = require("../middleware/verifyJWT");

exports.posts_list = [
  verifyJWT,
  (req, res, next) => {
    getPosts(req.query, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).end();
      }
      res.json(response);
    });
  },
];

exports.create_post = [
  createPostValidationRules(),
  validate,
  (req, res, next) => {
    addPost(req.body, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];

exports.get_single_post = [
  singlePostValidationRules(),
  validate,
  (req, res, next) => {
    getPost(req.params.id, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];

exports.delete_single_post = [
  singlePostValidationRules(),
  validate,
  (req, res, next) => {
    deletePost(req.params.id, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];

exports.update_single_post = [
  singlePostValidationRules(),
  updatePostValidationRules(),
  validate,
  (req, res, next) => {
    updatePost(req.params.id, req.body, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];
