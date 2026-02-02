const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    getTopSellers
} = require('../controllers/orderController');

// Analytics route (must come before /:id)
router.get('/analytics/top-sellers', getTopSellers);

// Main CRUD routes
router.route('/')
    .get(getOrders)
    .post(createOrder);

router.get('/:id', getOrder);

// Status update
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
