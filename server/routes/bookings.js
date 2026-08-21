const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, bookingsController.createBooking);
router.get('/', authenticate, bookingsController.getUserBookings);
router.get('/:id', authenticate, bookingsController.getBookingById);
router.put('/:id/status', authenticate, bookingsController.updateBookingStatus);

module.exports = router;