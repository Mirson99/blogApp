var express = require('express');
var router = express.Router();

const post_controller = require("../controllers/postController");

router.post('/', post_controller.create_post);
router.get('/', post_controller.posts_list);
router.get('/:id', post_controller.get_single_post);
router.delete('/:id', post_controller.delete_single_post);
router.put('/:id', post_controller.update_single_post);

module.exports = router;
