const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
            message: '{VALUE} is not a valid category'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    ingredients: {
        type: [String],
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number,
        min: [0, 'Preparation time cannot be negative'],
        default: 0
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Create text index for search functionality
menuItemSchema.index({ name: 'text', ingredients: 'text' });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function () {
    return `$${this.price.toFixed(2)}`;
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
