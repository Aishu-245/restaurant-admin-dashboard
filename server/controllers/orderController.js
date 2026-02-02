const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Get all orders with pagination and filtering
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        // Build query
        let query = {};
        if (status) {
            query.status = status;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .populate('items.menuItem', 'name price category')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            count: orders.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get single order with populated menu items
// @route   GET /api/orders/:id
// @access  Public
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.menuItem');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { items, customerName, tableNumber } = req.body;

        // Validate items exist and are available
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);

            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item ${item.menuItem} not found`
                });
            }

            if (!menuItem.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `${menuItem.name} is currently unavailable`
                });
            }

            const itemTotal = menuItem.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                menuItem: item.menuItem,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        const order = await Order.create({
            items: orderItems,
            totalAmount,
            customerName,
            tableNumber
        });

        const populatedOrder = await Order.findById(order._id)
            .populate('items.menuItem', 'name price category');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: populatedOrder
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('items.menuItem', 'name price category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get top selling menu items (Aggregation Challenge)
// @route   GET /api/orders/analytics/top-sellers
// @access  Public
const getTopSellers = async (req, res) => {
    try {
        const topSellers = await Order.aggregate([
            // Only include completed orders
            { $match: { status: { $in: ['Delivered'] } } },
            // Unwind items array
            { $unwind: '$items' },
            // Group by menu item and sum quantities
            {
                $group: {
                    _id: '$items.menuItem',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            // Lookup menu item details
            {
                $lookup: {
                    from: 'menuitems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'menuItemDetails'
                }
            },
            // Unwind the lookup result
            { $unwind: '$menuItemDetails' },
            // Project the fields we want
            {
                $project: {
                    _id: 1,
                    name: '$menuItemDetails.name',
                    category: '$menuItemDetails.category',
                    price: '$menuItemDetails.price',
                    imageUrl: '$menuItemDetails.imageUrl',
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            },
            // Sort by quantity sold
            { $sort: { totalQuantity: -1 } },
            // Limit to top 5
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            count: topSellers.length,
            data: topSellers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    getTopSellers
};
