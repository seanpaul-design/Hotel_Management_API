const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

exports.getBookings = async (req, res, next) => {
    try {
        // Extract pagination parameters (page & limit) from query string, or use defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter setup: allows filtering bookings by 'status'
        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        // Fetch bookings from DB with guest & room details populated
        const bookings = await Booking.find(filter)
        .populate('guestId', 'name email phone') // populate guest fields
        .populate('roomId', 'number type price') // populate room fields
        .limit(limit)                            // limit per page
        .skip(skip)                              // skip previous pages
        .sort({ checkIn: -1 });                  // sort newest check-ins first

        // Count total number of bookings for pagination metadata
        const total = await Booking.countDocuments(filter);

        // Send response with pagination info
        res.status(200).json({
        success: true,
        count: bookings.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: bookings
        });
    } catch (error) {
        next(error);
    }
    };

    exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('guestId').populate('roomId');
        if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
    };

    // CreateBooking function
    exports.createBooking = async (req, res, next) => {
    try {
        const { guestId, roomId, checkIn, checkOut } = req.body;

        // Verify guest exists
        const guest = await Guest.findById(guestId);
        if (!guest) {
        return res.status(404).json({
            success: false,
            message: 'Guest not found'
        });
        }

        // Verify room exists
        const room = await Room.findById(roomId);
        if (!room) {
        return res.status(404).json({
            success: false,
            message: 'Room not found'
        });
        }

        // Check if room is in maintenance
        if (room.status === 'maintenance') {
        return res.status(400).json({
            success: false,
            message: 'Room is currently under maintenance and cannot be booked'
        });
        }

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
        return res.status(400).json({
            success: false,
            message: 'Check-in date cannot be in the past'
        });
        }

        if (checkOutDate <= checkInDate) {
        return res.status(400).json({
            success: false,
            message: 'Check-out date must be after check-in date'
        });
        }

        // Check room availability (prevent double-booking)
        const conflictingBooking = await Booking.findOne({
        roomId,
        status: { $in: ['pending', 'confirmed', 'checked-in'] },
        $or: [
            { 
            checkIn: { $lte: checkOutDate }, 
            checkOut: { $gte: checkInDate } 
            }
        ]
        });

        if (conflictingBooking) {
        return res.status(400).json({
            success: false,
            message: 'Room is not available for the selected dates',
            conflictingBooking: {
            checkIn: conflictingBooking.checkIn,
            checkOut: conflictingBooking.checkOut
            }
        });
        }

        // Calculate total price
        const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalPrice = days * room.price;

        // Create booking
        const booking = await Booking.create({
        ...req.body,
        totalPrice
        });

        // Update room status to occupied (only if check-in is today or already started)
        if (checkInDate <= today) {
        await Room.findByIdAndUpdate(roomId, { status: 'occupied' });
        }

        const populatedBooking = await Booking.findById(booking._id)
        .populate('guestId')
        .populate('roomId');

        res.status(201).json({
        success: true,
        message: `Booking created successfully. Total: $${totalPrice} for ${days} night(s)`,
        data: populatedBooking
        });
    } catch (error) {
        next(error);
    }
    };


    exports.updateBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
        }).populate('guestId').populate('roomId');

        if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (req.body.status === 'checked-out') {
        await Room.findByIdAndUpdate(booking.roomId._id, { status: 'available' });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
    };

    exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });
        res.status(200).json({ success: true, message: 'Booking deleted successfully', data: {} });
    } catch (error) {
        next(error);
    }
};
