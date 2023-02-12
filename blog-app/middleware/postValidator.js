const { body, param, validationResult } = require("express-validator");
var ObjectId = require('mongoose').Types.ObjectId;

const createPostValidationRules = () => {
  return [
    body("title", "Title required").trim().isLength({ min: 3 }).escape(),
    body("description", "Description required")
      .trim()
      .isLength({ min: 3 })
      .escape(),
    body("category", "Category required").trim().isLength({ min: 1 }).escape(),
    body("author", "Author required").trim().isLength({ min: 1 }).escape(),
  ];
};

const updatePostValidationRules = () => {
  return [
    body("title", "Title required").trim().isLength({ min: 3 }).escape(),
    body("description", "Description required")
      .trim()
      .isLength({ min: 3 })
      .escape(),
  ];
};


const singlePostValidationRules = () => {
  return [
    param("id", "Post id required").exists().escape(),
    param("id", "Parameter is not valid post id").custom((id) => {
      return ObjectId.isValid(id); 
    }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  createPostValidationRules,
  singlePostValidationRules,
  updatePostValidationRules,
  validate,
};
