import React, { useState, useEffect } from 'react';
import { TrendingUp, Award } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const Analytics = () => {
    const [topSellers, setTopSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        fetchTopSellers();
    }, []);

    const fetchTopSellers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/analytics/top-sellers');
            setTopSellers(response.data.data);
        } catch (error) {
            showError('Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Analytics</h1>
                <p className="page-subtitle">Insights and performance metrics</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">
                        <Award size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Top 5 Selling Items
                    </h2>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading analytics...</p>
                    </div>
                ) : topSellers.length === 0 ? (
                    <div className="empty-state">
                        <p>No sales data available yet</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Total Sold</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topSellers.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: index === 0 ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                                                        index === 1 ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                                                            index === 2 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
                                                                'var(--neutral-300)',
                                                    color: index < 3 ? 'white' : 'var(--neutral-700)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700
                                                }}>
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <strong>{item.name}</strong>
                                        </td>
                                        <td>
                                            <span className="badge badge-secondary">{item.category}</span>
                                        </td>
                                        <td>
                                            <strong style={{ color: 'var(--primary-600)' }}>
                                                {item.totalQuantity} units
                                            </strong>
                                        </td>
                                        <td>
                                            <strong style={{ color: 'var(--secondary-600)', fontSize: '1.125rem' }}>
                                                ₹{item.totalRevenue}
                                            </strong>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">
                        <TrendingUp size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Performance Summary
                    </h2>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon success">
                            <Award size={24} />
                        </div>
                        <div className="stat-card-value">
                            {topSellers[0]?.name || 'N/A'}
                        </div>
                        <div className="stat-card-label">Best Selling Item</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon info">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-card-value">
                            {topSellers.reduce((sum, item) => sum + item.totalQuantity, 0)}
                        </div>
                        <div className="stat-card-label">Total Units Sold</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon primary">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-card-value">
                            ₹{topSellers.reduce((sum, item) => sum + item.totalRevenue, 0)}
                        </div>
                        <div className="stat-card-label">Total Revenue</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
