import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMenuItems: 0,
        availableItems: 0,
        totalOrders: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch menu items
            const menuResponse = await api.get('/menu');
            const menuItems = menuResponse.data.data;

            // Fetch orders
            const ordersResponse = await api.get('/orders', { params: { limit: 5 } });
            const orders = ordersResponse.data.data;

            setStats({
                totalMenuItems: menuItems.length,
                availableItems: menuItems.filter(item => item.isAvailable).length,
                totalOrders: ordersResponse.data.total,
                pendingOrders: menuItems.filter(item => !item.isAvailable).length
            });

            setRecentOrders(orders);
        } catch (error) {
            showError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome to your restaurant admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon primary">
                            <UtensilsCrossed size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">{stats.totalMenuItems}</div>
                    <div className="stat-card-label">Total Menu Items</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon success">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">{stats.availableItems}</div>
                    <div className="stat-card-label">Available Items</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon info">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">{stats.totalOrders}</div>
                    <div className="stat-card-label">Total Orders</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon warning">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="stat-card-value">{stats.pendingOrders}</div>
                    <div className="stat-card-label">Unavailable Items</div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Recent Orders</h2>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="empty-state">
                        <p>No recent orders</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Customer</th>
                                    <th>Table</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td><strong>{order.orderNumber}</strong></td>
                                        <td>{order.customerName}</td>
                                        <td>#{order.tableNumber}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td><strong>₹{order.totalAmount}</strong></td>
                                        <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
