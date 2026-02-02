require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const menuItems = [
    // Breakfast / Tiffins (South Indian Specialties)
    {
        name: 'Masala Dosa',
        description: 'Crispy fermented crepe stuffed with spiced potato filling, served with coconut chutney and sambar',
        category: 'Main Course',
        price: 120,
        ingredients: ['Rice Batter', 'Potatoes', 'Onions', 'Mustard Seeds', 'Curry Leaves'],
        isAvailable: true,
        preparationTime: 15,
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Idli Sambar',
        description: 'Steamed fluffy rice cakes served with lentil soup and chutney',
        category: 'Appetizer',
        price: 80,
        ingredients: ['Rice', 'Urad Dal', 'Lentils', 'Drumstick', 'Vegetables'],
        isAvailable: true,
        preparationTime: 10,
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Medu Vada',
        description: 'Crispy lentil donuts spiced with black pepper and curry leaves',
        category: 'Appetizer',
        price: 90,
        ingredients: ['Urad Dal', 'Peppercorns', 'Onions', 'Green Chilies', 'Oil'],
        isAvailable: true,
        preparationTime: 12,
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Rava Upma',
        description: 'Savory semolina porridge cooked with vegetables and nuts',
        category: 'Appetizer',
        price: 70,
        ingredients: ['Semolina', 'Carrots', 'Peas', 'Cashews', 'Mustard Seeds'],
        isAvailable: true,
        preparationTime: 15,
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'
    },

    // Main Courses
    {
        name: 'Hyderabadi Chicken Biryani',
        description: 'Aromatic basmati rice cooked with marinated chicken and authentic spices',
        category: 'Main Course',
        price: 350,
        ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Mint', 'Fried Onions'],
        isAvailable: true,
        preparationTime: 45,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Chettinad Chicken Curry',
        description: 'Spicy chicken curry from Tamil Nadu made with fresh roasted spices',
        category: 'Main Course',
        price: 280,
        ingredients: ['Chicken', 'Fennel Seeds', 'Coriander', 'Red Chilies', 'Coconut'],
        isAvailable: true,
        preparationTime: 30,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Kerala Fish Curry',
        description: 'Tangy and spicy fish curry cooked in coconut milk with kokum',
        category: 'Main Course',
        price: 320,
        ingredients: ['Fish', 'Coconut Milk', 'Kokum', 'Ginger', 'Curry Leaves'],
        isAvailable: true,
        preparationTime: 25,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'South Indian Thali',
        description: 'Complete meal with rice, sambar, rasam, kootu, poriyal, curd, and papad',
        category: 'Main Course',
        price: 250,
        ingredients: ['Rice', 'Lentils', 'Seasonal Vegetables', 'Curd', 'Spices'],
        isAvailable: true,
        preparationTime: 20,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Lemon Rice',
        description: 'Zesty rice dish tempered with mustard seeds, groundnuts, and curry leaves',
        category: 'Main Course',
        price: 130,
        ingredients: ['Rice', 'Lemon Juice', 'Peanuts', 'Turmeric', 'Green Chilies'],
        isAvailable: false,
        preparationTime: 15,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Bisibelebath',
        description: 'Spicy rice and lentil mash from Karnataka with vegetables',
        category: 'Main Course',
        price: 160,
        ingredients: ['Rice', 'Toor Dal', 'Tamarind', 'Mixed Vegetables', 'Ghee'],
        isAvailable: true,
        preparationTime: 25,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
    },

    // Desserts
    {
        name: 'Mysore Pak',
        description: 'Traditional sweet made from ghee, sugar, and gram flour that melts in your mouth',
        category: 'Dessert',
        price: 100,
        ingredients: ['Gram Flour', 'Ghee', 'Sugar'],
        isAvailable: true,
        preparationTime: 20,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Semiya Payasam',
        description: 'Creamy vermicelli pudding cooked with milk, cardamom, and nuts',
        category: 'Dessert',
        price: 120,
        ingredients: ['Vermicelli', 'Milk', 'Sugar', 'Cardamom', 'Cashews', 'Raisins'],
        isAvailable: true,
        preparationTime: 25,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Kesari Bath',
        description: 'Sweet semolina dessert infused with saffron and pineapple',
        category: 'Dessert',
        price: 90,
        ingredients: ['Rava', 'Sugar', 'Ghee', 'Saffron', 'Pineapple'],
        isAvailable: true,
        preparationTime: 15,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
    },

    // Beverages
    {
        name: 'Filter Coffee',
        description: 'Authentic South Indian coffee brewed in a traditional metal filter',
        category: 'Beverage',
        price: 40,
        ingredients: ['Coffee Powder', 'Milk', 'Sugar'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Masala Chai',
        description: 'Strong tea brewed with aromatic spices like cardamom and ginger',
        category: 'Beverage',
        price: 30,
        ingredients: ['Tea Leaves', 'Milk', 'Cardamom', 'Ginger', 'Sugar'],
        isAvailable: true,
        preparationTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Tender Coconut Water',
        description: 'Fresh and cooling natural coconut water',
        category: 'Beverage',
        price: 50,
        ingredients: ['Coconut'],
        isAvailable: true,
        preparationTime: 2,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
    },
    {
        name: 'Buttermilk (Neer Mor)',
        description: 'Spiced yogurt drink with green chili, ginger, and curry leaves',
        category: 'Beverage',
        price: 35,
        ingredients: ['Yogurt', 'Water', 'Green Chili', 'Ginger', 'Coriander'],
        isAvailable: true,
        preparationTime: 5,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting South Indian Database Seed...\n');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await MenuItem.deleteMany({});
        await Order.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Insert menu items
        console.log('📝 Inserting menu items with Rupees ₹...');
        const createdMenuItems = await MenuItem.insertMany(menuItems);
        console.log(`✅ ${createdMenuItems.length} authentic dishes created\n`);

        // Create sample orders
        console.log('📦 Creating sample orders with Indian customers...');

        // Helper to generate order number
        const generateOrderNum = (index) => {
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            return `ORD-${dateStr}-${String(index + 1).padStart(4, '0')}`;
        };

        const sampleOrders = [
            {
                orderNumber: generateOrderNum(0),
                items: [
                    { menuItem: createdMenuItems[0]._id, quantity: 2, price: createdMenuItems[0].price }, // 2 Masala Dosas
                    { menuItem: createdMenuItems[13]._id, quantity: 2, price: createdMenuItems[13].price } // 2 Coffees
                ],
                totalAmount: (createdMenuItems[0].price * 2) + (createdMenuItems[13].price * 2),
                status: 'Delivered',
                customerName: 'Rahul Dravid',
                tableNumber: 5
            },
            {
                orderNumber: generateOrderNum(1),
                items: [
                    { menuItem: createdMenuItems[4]._id, quantity: 2, price: createdMenuItems[4].price }, // 2 Biryanis
                    { menuItem: createdMenuItems[16]._id, quantity: 2, price: createdMenuItems[16].price } // 2 Buttermilks
                ],
                totalAmount: (createdMenuItems[4].price * 2) + (createdMenuItems[16].price * 2),
                status: 'Delivered',
                customerName: 'Priya Iyer',
                tableNumber: 3
            },
            {
                orderNumber: generateOrderNum(2),
                items: [
                    { menuItem: createdMenuItems[5]._id, quantity: 1, price: createdMenuItems[5].price }, // Chettinad Chicken
                    { menuItem: createdMenuItems[7]._id, quantity: 2, price: createdMenuItems[7].price } // 2 Thalis
                ],
                totalAmount: createdMenuItems[5].price + (createdMenuItems[7].price * 2),
                status: 'Ready',
                customerName: 'Amit Kumar',
                tableNumber: 7
            },
            {
                orderNumber: generateOrderNum(3),
                items: [
                    { menuItem: createdMenuItems[1]._id, quantity: 4, price: createdMenuItems[1].price }, // 4 Idlis
                    { menuItem: createdMenuItems[2]._id, quantity: 4, price: createdMenuItems[2].price }  // 4 Vadas
                ],
                totalAmount: (createdMenuItems[1].price * 4) + (createdMenuItems[2].price * 4),
                status: 'Delivered',
                customerName: 'Lakshmi Narayan',
                tableNumber: 2
            },
            {
                orderNumber: generateOrderNum(4),
                items: [
                    { menuItem: createdMenuItems[8]._id, quantity: 1, price: createdMenuItems[8].price }, // Lemon Rice
                    { menuItem: createdMenuItems[11]._id, quantity: 1, price: createdMenuItems[11].price }, // Payasam
                ],
                totalAmount: createdMenuItems[8].price + createdMenuItems[11].price,
                status: 'Preparing',
                customerName: 'Karthik Sivakumar',
                tableNumber: 4
            },
            {
                orderNumber: generateOrderNum(5),
                items: [
                    { menuItem: createdMenuItems[9]._id, quantity: 2, price: createdMenuItems[9].price }, // Bisibelebath
                    { menuItem: createdMenuItems[2]._id, quantity: 2, price: createdMenuItems[2].price }  // Vada
                ],
                totalAmount: (createdMenuItems[9].price * 2) + (createdMenuItems[2].price * 2),
                status: 'Delivered',
                customerName: 'Sneha Reddy',
                tableNumber: 8
            },
            {
                orderNumber: generateOrderNum(6),
                items: [
                    { menuItem: createdMenuItems[10]._id, quantity: 1, price: createdMenuItems[10].price }, // Mysore Pak
                    { menuItem: createdMenuItems[13]._id, quantity: 1, price: createdMenuItems[13].price } // Coffee
                ],
                totalAmount: createdMenuItems[10].price + createdMenuItems[13].price,
                status: 'Pending',
                customerName: 'Vikram Singh',
                tableNumber: 1
            },
            {
                orderNumber: generateOrderNum(7),
                items: [
                    { menuItem: createdMenuItems[6]._id, quantity: 1, price: createdMenuItems[6].price } // Fish Curry
                ],
                totalAmount: createdMenuItems[6].price,
                status: 'Delivered',
                customerName: 'Anjali Menon',
                tableNumber: 6
            },
            {
                orderNumber: generateOrderNum(8),
                items: [
                    { menuItem: createdMenuItems[7]._id, quantity: 3, price: createdMenuItems[7].price }, // 3 Thalis
                ],
                totalAmount: (createdMenuItems[7].price * 3),
                status: 'Delivered',
                customerName: 'Ramesh Babu',
                tableNumber: 9
            },
            {
                orderNumber: generateOrderNum(9),
                items: [
                    { menuItem: createdMenuItems[0]._id, quantity: 1, price: createdMenuItems[0].price }, // Dosa
                    { menuItem: createdMenuItems[14]._id, quantity: 1, price: createdMenuItems[14].price } // Chai
                ],
                totalAmount: createdMenuItems[0].price + createdMenuItems[14].price,
                status: 'Cancelled',
                customerName: 'Deepak Chopra',
                tableNumber: 10
            }
        ];

        const createdOrders = await Order.insertMany(sampleOrders);
        console.log(`✅ ${createdOrders.length} orders created\n`);

        console.log('═══════════════════════════════════════');
        console.log('🎉 Indian Style Database Seeding Completed! 🇮🇳');
        console.log('═══════════════════════════════════════');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
