const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    items: {
        type: [orderItemSchema],
        validate: {
            validator: function (items) {
                return items && items.length > 0;
            },
            message: 'Order must contain at least one item'
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
            message: '{VALUE} is not a valid status'
        },
        default: 'Pending'
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    tableNumber: {
        type: Number,
        required: [true, 'Table number is required'],
        min: [1, 'Table number must be at least 1']
    }
}, {
    timestamps: true
});

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        this.orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
