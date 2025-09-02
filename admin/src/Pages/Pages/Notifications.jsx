import React, { useState, useEffect } from 'react';
import { useAdminNotifications } from '../Context/AdminNotificationContext';
import { backend_url } from '../config';
import toast from 'react-hot-toast';
import './CSS/Notifications.css';

const Notifications = () => {
  const { notifications, isConnected, clearNotifications, removeNotification } = useAdminNotifications();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  
  // Notification creation states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stockAlertForm, setStockAlertForm] = useState({
    product_id: '',
    current_stock: '',
    threshold: ''
  });

  const [isCreating, setIsCreating] = useState(false);

  // Calculate statistics
  const totalNotifications = notifications.length;
  const orderNotifications = notifications.filter(n => n.type === 'new_order' || n.type === 'order_confirmation' || n.type === 'status_update').length;
  const stockAlerts = notifications.filter(n => n.type === 'stock_alert').length;
  
  // Debug logging
  console.log('📊 Admin Notifications Page - Total notifications:', totalNotifications);
  console.log('📊 Admin Notifications Page - Stock alerts count:', stockAlerts);
  console.log('📊 Admin Notifications Page - All notifications:', notifications);

  const todayNotifications = notifications.filter(n => {
    const today = new Date().toDateString();
    const notificationDate = new Date(n.timestamp).toDateString();
    return today === notificationDate;
  }).length;

  // Filter notifications based on selected filter and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order':
        return '🛒';
      case 'order_confirmation':
        return '✅';
      case 'status_update':
        return '📦';
      case 'stock_alert':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'new_order':
        return 'New Order';
      case 'order_confirmation':
        return 'Order Confirmation';
      case 'status_update':
        return 'Status Update';
      case 'stock_alert':
        return 'Stock Alert';
      default:
        return 'Notification';
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(n => n.id !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleDeleteSelected = () => {
    selectedNotifications.forEach(id => removeNotification(id));
    setSelectedNotifications([]);
  };

  const handleMarkAsRead = () => {
    // This would be implemented if we had read/unread functionality
    console.log('Mark as read functionality would be implemented here');
  };

  // Notification creation functions
  const handleCreateStockAlert = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      console.log('🚀 Creating stock alert with data:', stockAlertForm);
      const token = localStorage.getItem('auth-token');
      console.log('🔑 Using auth token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${backend_url}/api/notifications/stock-alert`, {
        method: 'POST',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockAlertForm),
      });
      
      console.log('📡 API Response status:', response.status);

      if (response.ok) {
        // Reset form
        setStockAlertForm({ product_id: '', current_stock: '', threshold: '' });
        setShowCreateForm(false);
        toast.success('Stock alert created successfully!', {
          duration: 4000,
          icon: '⚠️',
        });
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error}`, {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error creating stock alert:', error);
      toast.error('Failed to create stock alert', {
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };



  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🔔 Notification Center</h1>
            <p>Manage and monitor all system notifications in real-time</p>
          </div>
          <div className="header-right">
            <div className="connection-status">
              <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '🟢' : '🔴'}
              </span>
              <span>Live Connection: {isConnected ? 'Active' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="notifications-content">
        {/* Statistics Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card primary">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{totalNotifications}</div>
              <div className="stat-label">Total Notifications</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <div className="stat-number">{orderNotifications}</div>
              <div className="stat-label">Order Updates</div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <div className="stat-number">{stockAlerts}</div>
              <div className="stat-label">Stock Alerts</div>
            </div>
          </div>

          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-number">{todayNotifications}</div>
              <div className="stat-label">Today</div>
            </div>
          </div>
        </div>

        {/* Notification Management */}
        <div className="notification-management">
          <div className="management-header">
            <div className="management-left">
              <h3>📋 Notification History</h3>
              <p>View and manage all system notifications</p>
            </div>
            <div className="management-actions">
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)} 
                className="action-btn primary"
                style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)', color: 'white' }}
              >
                ➕ Create Notification
              </button>
              {selectedNotifications.length > 0 && (
                <>
                  <button onClick={handleMarkAsRead} className="action-btn secondary">
                    📖 Mark as Read
                  </button>
                  <button onClick={handleDeleteSelected} className="action-btn danger">
                    🗑️ Delete Selected ({selectedNotifications.length})
                  </button>
                </>
              )}
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="action-btn danger">
                  🗑️ Clear All
                </button>
              )}
            </div>
          </div>

          {/* Notification Creation Forms */}
          {showCreateForm && (
            <div className="create-notification-section">
              <div className="form-header">
                <h4>📝 Create New Notification</h4>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="close-form-btn"
                >
                  ×
                </button>
              </div>
              
              <div className="form-type-selector">
                <button className="form-type-btn active">
                  ⚠️ Stock Alert
                </button>
              </div>

              <form onSubmit={handleCreateStockAlert} className="notification-form">
                <div className="form-group">
                  <label>Product ID:</label>
                  <input
                    type="text"
                    value={stockAlertForm.product_id}
                    onChange={(e) => setStockAlertForm({...stockAlertForm, product_id: e.target.value})}
                    placeholder="Enter product ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Current Stock:</label>
                  <input
                    type="number"
                    value={stockAlertForm.current_stock}
                    onChange={(e) => setStockAlertForm({...stockAlertForm, current_stock: e.target.value})}
                    placeholder="Current stock quantity"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Threshold:</label>
                  <input
                    type="number"
                    value={stockAlertForm.threshold}
                    onChange={(e) => setStockAlertForm({...stockAlertForm, threshold: e.target.value})}
                    placeholder="Minimum stock threshold"
                    required
                  />
                </div>
                <button type="submit" disabled={isCreating} className="submit-btn">
                  {isCreating ? 'Creating...' : 'Create Stock Alert'}
                </button>
              </form>
            </div>
          )}

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="filter-controls">
              <div className="filter-group">
                <label>Filter by Type:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                  <option value="all">All Notifications</option>
                  <option value="new_order">New Orders</option>
                  <option value="order_confirmation">Order Confirmations</option>
                  <option value="status_update">Status Updates</option>
                  <option value="stock_alert">Stock Alerts</option>
                </select>
              </div>
              <div className="search-group">
                <label>Search:</label>
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="notifications-container">
            {filteredNotifications.length === 0 ? (
              <div className="no-notifications">
                <span>🔕</span>
                <h4>No notifications found</h4>
                <p>{searchTerm || filter !== 'all' ? 'Try adjusting your filters or search terms' : 'Notifications will appear here as they are generated'}</p>
              </div>
            ) : (
              <div className="notifications-list">
                <div className="list-header">
                  <div className="select-all">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={handleSelectAll}
                    />
                    <span>Select All</span>
                  </div>
                  <div className="list-info">
                    Showing {filteredNotifications.length} of {totalNotifications} notifications
                  </div>
                </div>
                
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className={`notification-item ${selectedNotifications.includes(notification.id) ? 'selected' : ''}`}>
                    <div className="notification-select">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                      />
                    </div>
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-type">{getNotificationTypeLabel(notification.type)}</span>
                        <span className="notification-time">{formatTime(notification.timestamp)}</span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      {notification.order_id && (
                        <div className="notification-details">
                          <span className="detail-item">Order ID: #{notification.order_id}</span>
                          {notification.quantity && <span className="detail-item">Qty: {notification.quantity}</span>}
                          {notification.total_price && <span className="detail-item">Total: ${notification.total_price}</span>}
                        </div>
                      )}
                    </div>
                    <div className="notification-actions">
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="remove-btn"
                        title="Delete notification"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
