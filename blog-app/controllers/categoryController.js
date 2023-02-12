const {
  getCategories,
  addCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../services/categories.service");

exports.categories_list = function (req, res, next) {
  getCategories(function (response) {
    if (response instanceof Error) {
      return res.status(response.status).end();
    }
    res.json(response);
  });
};

exports.create_category = [
  (req, res, next) => {
    addCategory(req.body, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];

exports.get_category = [
  (req, res, next) => {
    getCategory(req.params.id, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];

exports.delete_category = [
  (req, res, next) => {
    deleteCategory(req.params.id, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];

exports.update_category = [
  (req, res, next) => {
    updateCategory(req.params.id, req.body, function (response) {
      if (response instanceof Error) {
        return res.status(response.status).json(response.message).end();
      }
      res.json(response);
    });
  },
];
