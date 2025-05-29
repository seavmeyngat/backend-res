// routes/notificationRoute.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.createClosedNotification);
router.put('/:id', notificationController.updateNotification);
router.get('/', notificationController.getAllNotifications);
router.get('/current', notificationController.getCurrentCloseNotifications);
router.delete('/:id', notificationController.deleteNotification);
router.post('/fullbooking', notificationController.createFullBookingNotification);
router.get('/getFullbooking', notificationController.getFullBookingNotification);
module.exports = router;
