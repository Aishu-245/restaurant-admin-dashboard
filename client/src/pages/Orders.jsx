import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, User, Hash, DollarSign, Clock } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10
            };
            if (statusFilter) params.status = statusFilter;

            const response = await api.get('/orders', { params });
            setOrders(response.data.data);
            setTotalPages(response.data.pages || 1);
        } catch (error) {
            showError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await api.patch(`/orders/${orderId}/status`, {
                status: newStatus
            });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? response.data.data : order
                )
            );

            showSuccess(`Order status updated to ${newStatus}`);
        } catch (error) {
            showError('Failed to update order status');
        }
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'Pending': 'badge-warning',
            'Preparing': 'badge-info',
            'Ready': 'badge-success',
            'Delivered': 'badge-secondary',
            'Cancelled': 'badge-danger'
        };
        return statusClasses[status] || 'badge-secondary';
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Orders Dashboard</h1>
                <p className="page-subtitle">Track and manage customer orders</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon primary">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">{orders.length}</div>
                    <div className="stat-card-label">Current Orders</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="filters">
                    <div className="filter-group">
                        <label className="form-label">Filter by Status</label>
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Orders</option>
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <ShoppingBag size={64} />
                    </div>
                    <h3>No orders found</h3>
                    <p>There are no orders matching your criteria</p>
                </div>
            ) : (
                <>
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <h3 className="order-number">{order.orderNumber}</h3>
                                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => toggleOrderExpand(order._id)}
                                >
                                    {expandedOrders.has(order._id) ? (
                                        <>
                                            <ChevronUp size={16} />
                                            Hide Details
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={16} />
                                            View Details
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="order-details">
                                <div className="order-detail-item">
                                    <div className="order-detail-label">
                                        <User size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        Customer
                                    </div>
                                    <div className="order-detail-value">{order.customerName}</div>
                                </div>

                                <div className="order-detail-item">
                                    <div className="order-detail-label">
                                        <Hash size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        Table
                                    </div>
                                    <div className="order-detail-value">#{order.tableNumber}</div>
                                </div>

                                <div className="order-detail-item">
                                    <div className="order-detail-label">
                                        <DollarSign size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        Total
                                    </div>
                                    <div className="order-detail-value">₹{order.totalAmount.toFixed(2)}</div>
                                </div>

                                <div className="order-detail-item">
                                    <div className="order-detail-label">
                                        <Clock size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        Ordered At
                                    </div>
                                    <div className="order-detail-value">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {expandedOrders.has(order._id) && (
                                <div className="order-items">
                                    <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                                        Order Items
                                    </h4>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div>
                                                <strong>{item.menuItem?.name || 'Item'}</strong>
                                                <span style={{ color: 'var(--neutral-500)', marginLeft: '0.5rem' }}>
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                            <div>${(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--neutral-200)' }}>
                                <label className="form-label">Update Status</label>
                                <select
                                    className="form-select"
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    style={{ maxWidth: '300px' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Orders;
