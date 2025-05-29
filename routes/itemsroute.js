
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemscontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/create', authMiddleware, itemController.createItem)
router.get('/getAll', itemController.getItems);
router.get('/getBy/:id', itemController.getItemById);
router.put('/updateBy/:id',authMiddleware, itemController.updateItem);
router.delete('/deleteBy/:id',authMiddleware, itemController.deleteItem);

module.exports = router;


