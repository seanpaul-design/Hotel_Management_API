const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: [true, 'Guest ID is required']
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Room ID is required']
    },
    checkIn: {
        type: Date,
        required: [true, 'Check-in date is required']
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out date is required'],
        validate: {
        validator: function(value) {
            return value > this.checkIn;
        },
        message: 'Check-out date must be after check-in date'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
        default: 'pending',
        lowercase: true
    },
    totalPrice: {
        type: Number,
        min: 0
    },
    notes: {
        type: String,
        trim: true
    }
    }, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
