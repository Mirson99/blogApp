const Category = require("../models/category");
const async = require("async");

const getCategories = async (cb) => {
  await Category.find()
    .sort([["name"]])
    .exec(function (err, categories) {
      if (err) {
        err.status = 500;
        return cb(err);
      }
      return cb(categories);
    });
};

const addCategory = async (params, cb) => {
  const category = new Category({
    name: params.name,
  });

  async.series(
    {
      categories(callback) {
        Category.find({name: params.name})
          .exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return cb(err);
      }
      if (results.categories.length) {
        const err = new Error("Category already exists");
        err.status = 400;
        return cb(err);
      } else {
        category.save();
        return cb(category);
      }
    }
  );
};

const getCategory = (categoryId, cb) => {
  Category.findById(categoryId)
    .exec(function (err, category) {
      if (category === null) {
        err = new Error("Category not found");
        err.status = 404;
      }

      if (err) {
        return cb(err);
      }

      return cb(category);
    });
};

const deleteCategory = (categoryId, cb) => {
  Category.findByIdAndRemove(categoryId).exec(function (err, category) {
    if (category === null) {
      err = new Error("Category not found");
      err.status = 404;
    }

    if (err) {
      return cb(err);
    }

    return cb(category);
  });
};

const updateCategory = (categoryId, body, cb) => {
  async.waterfall(
    [
      function (callback) {
        Category.findById(categoryId, function (err, category) {
          if (category == null) {
            err = new Error("Category not found");
            err.status = 404;
            callback(err, null);
          } else {
            callback(null, category);
          }
        });
      },
      function (category, callback) {
        const updatedCategory = new Category({
          name: body.name,
          _id: categoryId,
        });

        Category.findByIdAndUpdate(categoryId, updatedCategory, {}, (err) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, updatedCategory);
          }
        });
      },
    ],
    function (err, newcategory) {
      if (err) {
        return cb(err);
      }

      return cb(newcategory);
    }
  );
};

module.exports = {
  getCategories,
  addCategory,
  getCategory,
  deleteCategory,
  updateCategory,
};
