const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    searchMenuItems,
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
} = require('../controllers/menuController');

// Search route must come before /:id to avoid conflicts
router.get('/search', searchMenuItems);

// Main CRUD routes
router.route('/')
    .get(getMenuItems)
    .post(createMenuItem);

router.route('/:id')
    .get(getMenuItem)
    .put(updateMenuItem)
    .delete(deleteMenuItem);

// Availability toggle
router.patch('/:id/availability', toggleAvailability);

module.exports = router;
