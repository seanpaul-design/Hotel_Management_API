const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: {
        type: String,
        required: [true, 'Room number is required'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['single', 'double', 'suite', 'deluxe'],
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available',
        lowercase: true
    },
    amenities: {
        type: [String],
        default: []
    },
    capacity: {
        type: Number,
        default: 1,
        min: 1
    }
    }, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
