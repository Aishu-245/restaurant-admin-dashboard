require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const seedOrdersOnly = async () => {
    try {
        console.log('🌱 Starting Order Seeding...');

        // Connect to database
        await connectDB();

        // Check if menu items exist
        const menuItems = await MenuItem.find();
        console.log(`✅ Found ${menuItems.length} menu items`);

        if (menuItems.length === 0) {
            console.error('❌ No menu items found. Run full seed first.');
            process.exit(1);
        }

        // Clear existing orders to avoid duplicates/mess
        console.log('🗑️  Clearing existing orders...');
        await Order.deleteMany({});
        console.log('✅ Existing orders cleared');

        // Helper to generate order number
        const generateOrderNum = (index) => {
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            return `ORD-${dateStr}-${String(index + 1).padStart(4, '0')}`;
        };

        const sampleOrders = [
            {
                orderNumber: generateOrderNum(0),
                items: [
                    { menuItem: menuItems[0]._id, quantity: 2, price: menuItems[0].price },
                    { menuItem: menuItems[4]._id, quantity: 1, price: menuItems[4].price }
                ],
                totalAmount: (menuItems[0].price * 2) + menuItems[4].price,
                status: 'Delivered',
                customerName: 'John Smith',
                tableNumber: 5
            },
            {
                orderNumber: generateOrderNum(1),
                items: [
                    { menuItem: menuItems[6]._id, quantity: 2, price: menuItems[6].price },
                    { menuItem: menuItems[13]._id, quantity: 2, price: menuItems[13].price }
                ],
                totalAmount: (menuItems[6].price * 2) + (menuItems[13].price * 2),
                status: 'Delivered',
                customerName: 'Sarah Johnson',
                tableNumber: 3
            },
            {
                orderNumber: generateOrderNum(2),
                items: [
                    { menuItem: menuItems[5]._id, quantity: 1, price: menuItems[5].price },
                    { menuItem: menuItems[10]._id, quantity: 1, price: menuItems[10].price }
                ],
                totalAmount: menuItems[5].price + menuItems[10].price,
                status: 'Ready',
                customerName: 'Michael Brown',
                tableNumber: 7
            },
            {
                orderNumber: generateOrderNum(3),
                items: [
                    { menuItem: menuItems[4]._id, quantity: 3, price: menuItems[4].price },
                    { menuItem: menuItems[14]._id, quantity: 3, price: menuItems[14].price }
                ],
                totalAmount: (menuItems[4].price * 3) + (menuItems[14].price * 3),
                status: 'Delivered',
                customerName: 'Emily Davis',
                tableNumber: 2
            },
            {
                orderNumber: generateOrderNum(4),
                items: [
                    { menuItem: menuItems[7]._id, quantity: 1, price: menuItems[7].price },
                    { menuItem: menuItems[11]._id, quantity: 1, price: menuItems[11].price },
                    { menuItem: menuItems[13]._id, quantity: 1, price: menuItems[13].price }
                ],
                totalAmount: menuItems[7].price + menuItems[11].price + menuItems[13].price,
                status: 'Preparing',
                customerName: 'David Wilson',
                tableNumber: 4
            },
            {
                orderNumber: generateOrderNum(5),
                items: [
                    { menuItem: menuItems[9]._id, quantity: 2, price: menuItems[9].price },
                    { menuItem: menuItems[15]._id, quantity: 2, price: menuItems[15].price }
                ],
                totalAmount: (menuItems[9].price * 2) + (menuItems[15].price * 2),
                status: 'Delivered',
                customerName: 'Lisa Anderson',
                tableNumber: 8
            },
            {
                orderNumber: generateOrderNum(6),
                items: [
                    { menuItem: menuItems[1]._id, quantity: 1, price: menuItems[1].price },
                    { menuItem: menuItems[6]._id, quantity: 1, price: menuItems[6].price }
                ],
                totalAmount: menuItems[1].price + menuItems[6].price,
                status: 'Pending',
                customerName: 'Robert Taylor',
                tableNumber: 1
            },
            {
                orderNumber: generateOrderNum(7),
                items: [
                    { menuItem: menuItems[4]._id, quantity: 2, price: menuItems[4].price }
                ],
                totalAmount: menuItems[4].price * 2,
                status: 'Delivered',
                customerName: 'Jennifer Martinez',
                tableNumber: 6
            },
            {
                orderNumber: generateOrderNum(8),
                items: [
                    { menuItem: menuItems[6]._id, quantity: 3, price: menuItems[6].price },
                    { menuItem: menuItems[1]._id, quantity: 1, price: menuItems[1].price }
                ],
                totalAmount: (menuItems[6].price * 3) + menuItems[1].price,
                status: 'Delivered',
                customerName: 'Christopher Garcia',
                tableNumber: 9
            },
            {
                orderNumber: generateOrderNum(9),
                items: [
                    { menuItem: menuItems[5]._id, quantity: 1, price: menuItems[5].price },
                    { menuItem: menuItems[12]._id, quantity: 2, price: menuItems[12].price },
                    { menuItem: menuItems[14]._id, quantity: 1, price: menuItems[14].price }
                ],
                totalAmount: menuItems[5].price + (menuItems[12].price * 2) + menuItems[14].price,
                status: 'Cancelled',
                customerName: 'Amanda Lee',
                tableNumber: 10
            }
        ];

        console.log('📦 Creating 10 sample orders...');
        const createdOrders = await Order.insertMany(sampleOrders);
        console.log(`✅ Success! ${createdOrders.length} orders created.`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seedOrdersOnly();
