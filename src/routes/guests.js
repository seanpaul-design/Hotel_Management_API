const express = require('express');
const router = express.Router();
const { getGuests, getGuest, createGuest, updateGuest, deleteGuest, getGuestBookings } = require('../controllers/guestController');

router.route('/').get(getGuests).post(createGuest);
router.route('/:id').get(getGuest).put(updateGuest).delete(deleteGuest);
router.route('/:id/bookings').get(getGuestBookings);

module.exports = router;
