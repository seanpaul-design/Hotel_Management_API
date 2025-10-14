const express = require('express');
const router = express.Router();
const {getRooms, getRoom, createRoom, updateRoom, deleteRoom, getAvailableRooms, getRoomBookings} = require('../controllers/roomController');

// Available rooms endpoint (must come before /:id)
router.get('/available', getAvailableRooms);

// Standard CRUD
router.route('/').get(getRooms).post(createRoom);

// Room bookings history
router.get('/:id/bookings', getRoomBookings);

// Single room operations
router.route('/:id').get(getRoom).put(updateRoom).delete(deleteRoom);

module.exports = router;


