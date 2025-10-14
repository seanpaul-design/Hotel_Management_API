const Guest = require('../models/Guest');

exports.getGuests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const guests = await Guest.find().limit(limit).skip(skip).sort({ createdAt: -1 });
        const total = await Guest.countDocuments();

        res.status(200).json({
        success: true,
        count: guests.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: guests
        });
    } catch (error) {
        next(error);
    }
};

    // GetGuest function
exports.getGuest = async (req, res, next) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (!guest) {
        return res.status(404).json({ success: false, message: 'Guest not found' });
        }
        res.status(200).json({ success: true, data: guest });
    } catch (error) {
        next(error);
    }
};

// CreateGuest function
exports.createGuest = async (req, res, next) => {
    try {
        const guest = await Guest.create(req.body);
        res.status(201).json({ success: true, data: guest });
    } catch (error) {
        next(error);
    }
};

// UpdateGuest function
exports.updateGuest = async (req, res, next) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
        });
        if (!guest) {
        return res.status(404).json({ success: false, message: 'Guest not found' });
        }
        res.status(200).json({ success: true, data: guest });
    } catch (error) {
        next(error);
    }
};

// DeleteGuest function
exports.deleteGuest = async (req, res, next) => {
    try {
        const guest = await Guest.findById(req.params.id);

        if (!guest) {
        return res.status(404).json({
            success: false,
            message: 'Guest not found'
        });
        }

        // Check if guest has active bookings
        const Booking = require('../models/Booking');
        const activeBookings = await Booking.find({
        guestId: req.params.id,
        status: { $in: ['pending', 'confirmed', 'checked-in'] }
        });

        if (activeBookings.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Cannot delete guest. They have ${activeBookings.length} active booking(s)`,
            activeBookings: activeBookings.length
        });
        }

        await Guest.findByIdAndDelete(req.params.id);

        res.status(200).json({
        success: true,
        message: 'Guest deleted successfully',
        data: {}
        });
    } catch (error) {
        next(error);
    }
};


exports.getGuestBookings = async (req, res, next) => {
    try {
        const Booking = require('../models/Booking');
        const bookings = await Booking.find({ guestId: req.params.id }).populate('roomId').sort({ checkIn: -1 });
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
};
