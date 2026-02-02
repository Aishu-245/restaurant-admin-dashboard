import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../api/axios';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../context/ToastContext';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const { showSuccess, showError } = useToast();

    // Debounce search query (Challenge 1: Debouncing)
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Fetch menu items
    useEffect(() => {
        fetchMenuItems();
    }, [categoryFilter, availabilityFilter]);

    // Search when debounced query changes
    useEffect(() => {
        if (debouncedSearchQuery) {
            searchMenuItems();
        } else {
            fetchMenuItems();
        }
    }, [debouncedSearchQuery]);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const params = {};
            if (categoryFilter) params.category = categoryFilter;
            if (availabilityFilter) params.availability = availabilityFilter;

            const response = await api.get('/menu', { params });
            setMenuItems(response.data.data);
        } catch (error) {
            showError('Failed to fetch menu items');
        } finally {
            setLoading(false);
        }
    };

    const searchMenuItems = async () => {
        try {
            setSearchLoading(true);
            const response = await api.get('/menu/search', {
                params: { q: debouncedSearchQuery }
            });
            setMenuItems(response.data.data);
        } catch (error) {
            showError('Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    // Challenge 3: Optimistic UI Update
    const toggleAvailability = async (item) => {
        const previousItems = [...menuItems];

        // 1. Update UI immediately (Optimistic)
        setMenuItems(prevItems =>
            prevItems.map(menuItem =>
                menuItem._id === item._id
                    ? { ...menuItem, isAvailable: !menuItem.isAvailable }
                    : menuItem
            )
        );

        try {
            // 2. Make API call in background
            await api.patch(`/menu/${item._id}/availability`);
            showSuccess(`${item.name} ${!item.isAvailable ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            // 3. Rollback on error
            setMenuItems(previousItems);
            showError('Failed to update availability. Changes reverted.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/menu/${id}`);
            setMenuItems(prevItems => prevItems.filter(item => item._id !== id));
            showSuccess('Menu item deleted successfully');
        } catch (error) {
            showError('Failed to delete menu item');
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleSave = async (formData) => {
        try {
            if (editingItem) {
                const response = await api.put(`/menu/${editingItem._id}`, formData);
                setMenuItems(prevItems =>
                    prevItems.map(item =>
                        item._id === editingItem._id ? response.data.data : item
                    )
                );
                showSuccess('Menu item updated successfully');
            } else {
                const response = await api.post('/menu', formData);
                setMenuItems(prevItems => [response.data.data, ...prevItems]);
                showSuccess('Menu item created successfully');
            }
            closeModal();
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to save menu item');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Menu Management</h1>
                <p className="page-subtitle">Manage your restaurant's menu items</p>
            </div>

            {/* Search and Filters */}
            <div className="card">
                <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search menu items by name or ingredients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchLoading && (
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                            <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        </div>
                    )}
                </div>

                <div className="filters">
                    <div className="filter-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Beverage">Beverage</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="form-label">Availability</label>
                        <select
                            className="form-select"
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value)}
                        >
                            <option value="">All Items</option>
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                        </select>
                    </div>

                    <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            <Plus size={20} />
                            Add New Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Items Grid */}
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading menu items...</p>
                </div>
            ) : menuItems.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Search size={64} />
                    </div>
                    <h3>No menu items found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="menu-grid">
                    {menuItems.map((item) => (
                        <div key={item._id} className="menu-card">
                            <img
                                src={item.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                                alt={item.name}
                                className="menu-card-image"
                            />
                            <div className="menu-card-body">
                                <div className="menu-card-header">
                                    <div>
                                        <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                                        <p className="menu-card-category">{item.category}</p>
                                    </div>
                                    <div className="menu-card-price">₹{item.price}</div>
                                </div>

                                <p className="menu-card-description">{item.description}</p>

                                {item.ingredients && item.ingredients.length > 0 && (
                                    <div className="menu-card-tags">
                                        {item.ingredients.slice(0, 3).map((ingredient, index) => (
                                            <span key={index} className="tag">{ingredient}</span>
                                        ))}
                                        {item.ingredients.length > 3 && (
                                            <span className="tag">+{item.ingredients.length - 3} more</span>
                                        )}
                                    </div>
                                )}

                                <div className="menu-card-footer">
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={item.isAvailable}
                                            onChange={() => toggleAvailability(item)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                                        {item.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>

                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => openModal(item)}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(item._id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <MenuItemModal
                    item={editingItem}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

// Menu Item Modal Component
const MenuItemModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        description: item?.description || '',
        category: item?.category || 'Appetizer',
        price: item?.price || '',
        ingredients: item?.ingredients?.join(', ') || '',
        preparationTime: item?.preparationTime || '',
        imageUrl: item?.imageUrl || '',
        isAvailable: item?.isAvailable ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            price: parseFloat(formData.price),
            preparationTime: parseInt(formData.preparationTime) || 0,
            ingredients: formData.ingredients
                .split(',')
                .map(i => i.trim())
                .filter(i => i),
        };

        onSave(submitData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{item ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                    <button onClick={onClose} className="btn btn-icon btn-secondary">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select
                                className="form-select"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="Appetizer">Appetizer</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Beverage">Beverage</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ingredients (comma-separated)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.ingredients}
                                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                placeholder="e.g., Tomatoes, Basil, Mozzarella"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Preparation Time (minutes)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.preparationTime}
                                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                />
                                <span className="form-label" style={{ marginBottom: 0 }}>Available</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {item ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuManagement;
