var express = require('express');
var router = express.Router();

const category_controller = require("../controllers/categoryController");

router.post('/', category_controller.create_category);
router.get('/', category_controller.categories_list);
router.get('/:id', category_controller.get_category);
router.delete('/:id', category_controller.delete_category);
router.put('/:id', category_controller.update_category);

module.exports = router;
