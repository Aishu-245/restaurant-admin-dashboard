import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import './index.css';

function App() {
    return (
        <ToastProvider>
            <Router>
                <div className="app">
                    <Sidebar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/menu" element={<MenuManagement />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/analytics" element={<Analytics />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ToastProvider>
    );
}

export default App;
