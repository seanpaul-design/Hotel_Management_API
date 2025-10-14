const Room = require('../models/Room');

exports.getRooms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const rooms = await Room.find(filter).limit(limit).skip(skip).sort({ number: 1 });
    const total = await Room.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

  // GetRoom function
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

  // CreateRoom function
exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

  // UpdateRoom function
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

  // DeleteRoom function
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room has active bookings
    const Booking = require('../models/Booking');
    const activeBookings = await Booking.find({
      roomId: req.params.id,
      status: { $in: ['pending', 'confirmed', 'checked-in'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete room. It has ${activeBookings.length} active booking(s)`,
        activeBookings: activeBookings.length
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};


  // @desc    Check room availability for date range
  // @route   GET /api/rooms/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
exports.getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, type } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide checkIn and checkOut dates'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    const Booking = require('../models/Booking');

    // Find all rooms that have conflicting bookings
    const conflictingBookings = await Booking.find({
      status: { $in: ['pending', 'confirmed', 'checked-in'] },
      $or: [
        { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } }
      ]
    }).select('roomId');

    const bookedRoomIds = conflictingBookings.map(b => b.roomId);

    // Find available rooms (not in bookedRoomIds and status is available)
    const filter = {
      _id: { $nin: bookedRoomIds },
      status: 'available'
    };

    if (type) {
      filter.type = type;
    }

    const availableRooms = await Room.find(filter).sort({ price: 1 });

    res.status(200).json({
      success: true,
      checkIn,
      checkOut,
      count: availableRooms.length,
      data: availableRooms
    });
  } catch (error) {
    next(error);
  }
};

  // @desc    Get room booking history
  // @route   GET /api/rooms/:id/bookings
exports.getRoomBookings = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const bookings = await Booking.find({ roomId: req.params.id })
      .populate('guestId', 'name email phone')
      .sort({ checkIn: -1 });

    res.status(200).json({
      success: true,
      room: {
        number: room.number,
        type: room.type,
        status: room.status
      },
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};