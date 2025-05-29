const express = require('express');
const router = express.Router();
const controller = require('../controllers/weeklymenucontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/create', authMiddleware, controller.createWeeklyMenu);
router.get('/getAll', controller.getWeeklyMenus);
router.get('/range', controller.getMenusByDateRangeOrToday);
router.get('/getBy/:id', controller.getWeeklyMenuById);
router.put('/updateBy/:id', authMiddleware, controller.updateWeeklyMenu);
router.delete('/deleteBy/:id', authMiddleware, controller.deleteWeeklyMenu);

module.exports = router;

