const express = require('express');
const router = express.Router();
const openingController = require('../controllers/openingcontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/new', authMiddleware, openingController.createOpening);
router.get('/getAll', openingController.getAllOpening);
router.get('/getBy/:id', openingController.getOpeningById);
router.put('/:id', authMiddleware, openingController.updateOpening);
router.delete('/:id', authMiddleware, openingController.deleteOpening);

module.exports = router;
