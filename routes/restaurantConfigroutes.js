const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantConfigcontroller');

router.post('/new', controller.createRestaurantConfig);
router.get('/getAll', controller.getAllRestaurantConfigs);
router.get('/:id', controller.getRestaurantConfigById);
router.put('/:id', controller.updateRestaurantConfig);
router.delete('/:id', controller.deleteRestaurantConfig);

module.exports = router;
                                                                             