require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const MenuItem = require('../models/MenuItem');

const checkImages = async () => {
    try {
        await connectDB();
        const items = await MenuItem.find({}, 'name imageUrl');

        console.log('\n🔍 Current Database Image URLs:');
        console.log('-----------------------------------');
        items.forEach(item => {
            console.log(`Resource: ${item.name}`);
            console.log(`URL:      ${item.imageUrl}`);
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkImages();
