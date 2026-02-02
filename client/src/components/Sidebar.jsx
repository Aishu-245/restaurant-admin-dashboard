import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChefHat, UtensilsCrossed, ShoppingBag, BarChart3, Home } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/menu', icon: UtensilsCrossed, label: 'Menu Management' },
        { path: '/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <ChefHat size={28} />
                </div>
                <div className="sidebar-logo-text">
                    <h2>Eatoes</h2>
                    <p>Admin Dashboard</p>
                </div>
            </div>

            <nav>
                <ul className="sidebar-nav">
                    {navItems.map((item) => (
                        <li key={item.path} className="sidebar-nav-item">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-nav-link ${isActive ? 'active' : ''}`
                                }
                                end={item.path === '/'}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
