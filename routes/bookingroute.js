const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingcontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/create', authMiddleware, bookingController.createBooking);
router.get('/getAll', bookingController.getAllBookings);
router.get('/getBy/:id', bookingController.getBookingById);
router.put('/updateBy/:id', authMiddleware, bookingController.updateBooking);
router.put('/:id/status', bookingController.updateBookingStatus);
router.delete('/deleteBy/:id', authMiddleware, bookingController.deleteBooking);


module.exports = router;