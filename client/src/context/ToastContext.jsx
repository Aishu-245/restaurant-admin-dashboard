import React, { createContext, useState, useContext, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showSuccess = (message) => addToast(message, 'success');
    const showError = (message) => addToast(message, 'error');
    const showWarning = (message) => addToast(message, 'warning');
    const showInfo = (message) => addToast(message, 'info');

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    return (
        <div className={`toast ${type}`}>
            <div className="toast-content">
                {type === 'success' && '✓ '}
                {type === 'error' && '✕ '}
                {type === 'warning' && '⚠ '}
                {type === 'info' && 'ℹ '}
                {message}
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>
                ×
            </button>
        </div>
    );
};
