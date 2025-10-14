require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../src/models/Room');
const Guest = require('../src/models/Guest');
const Booking = require('../src/models/Booking');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
    };

    const seedData = async () => {
    try {
        // Clear existing data
        await Room.deleteMany();
        await Guest.deleteMany();
        await Booking.deleteMany();

        // Create rooms
        const rooms = await Room.insertMany([
        { number: '101', type: 'single', price: 100, status: 'available', capacity: 1, amenities: ['WiFi', 'TV'] },
        { number: '102', type: 'double', price: 150, status: 'available', capacity: 2, amenities: ['WiFi', 'TV', 'Mini Bar'] },
        { number: '103', type: 'suite', price: 300, status: 'available', capacity: 4, amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi'] },
        { number: '201', type: 'single', price: 100, status: 'available', capacity: 1, amenities: ['WiFi', 'TV'] },
        { number: '202', type: 'double', price: 150, status: 'occupied', capacity: 2, amenities: ['WiFi', 'TV', 'Mini Bar'] },
        { number: '203', type: 'deluxe', price: 250, status: 'available', capacity: 3, amenities: ['WiFi', 'TV', 'Mini Bar', 'Balcony'] },
        { number: '301', type: 'suite', price: 350, status: 'available', capacity: 4, amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi', 'Kitchen'] },
        { number: '302', type: 'deluxe', price: 250, status: 'maintenance', capacity: 3, amenities: ['WiFi', 'TV', 'Mini Bar', 'Balcony'] }
        ]);

        // Create guests
        const guests = await Guest.insertMany([
        { name: 'John Carlo', email: 'john.carlo@email.com', phone: '+1234567890', address: '123 Main St, New York' },
        { name: 'Nelia MIranda', email: 'neliamiranda@email.com', phone: '+1234567891', address: '456 Oak Ave, Los Angeles' },
        { name: 'Bob Johnson', email: 'bob.johnson@email.com', phone: '+1234567892', address: '789 Pine Rd, Chicago' },
        { name: 'Vivian elemento', email: 'vivianelemento@email.com', phone: '+1234567893', address: '321 Elm St, Houston' },
        { name: 'Charlie Brownish', email: 'charlie.brownish@email.com', phone: '+1234567894', address: '654 Maple Dr, Phoenix' }
        ]);

        // Create bookings
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        await Booking.insertMany([
        {
            guestId: guests[0]._id,
            roomId: rooms[4]._id, // Room 202
            checkIn: today,
            checkOut: nextWeek,
            status: 'checked-in',
            totalPrice: 1050,
            notes: 'Early check-in requested'
        },
        {
            guestId: guests[1]._id,
            roomId: rooms[2]._id, // Room 103
            checkIn: tomorrow,
            checkOut: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000),
            status: 'confirmed',
            totalPrice: 900
        },
        {
            guestId: guests[2]._id,
            roomId: rooms[0]._id, // Room 101
            checkIn: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
            checkOut: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
            status: 'pending',
            totalPrice: 300
        }
        ]);

        console.log('✅ Data seeded successfully!');
        console.log(`   - ${rooms.length} rooms created`);
        console.log(`   - ${guests.length} guests created`);
        console.log(`   - 3 bookings created`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

connectDB().then(() => seedData());
