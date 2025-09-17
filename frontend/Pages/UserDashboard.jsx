import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../App';
import './UserDashboard.css';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const now = Date.now();
    // Only fetch if it's been more than 30 seconds since last fetch
    if (now - lastFetchTime > 30000) {
      fetchUserData();
      setLastFetchTime(now);
    }
    
    if (activeTab === 'orders' && userOrders.length === 0) {
      fetchUserOrders();
    }
  }, [activeTab, lastFetchTime, userOrders.length]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${backend_url}/api/user/dashboard`, {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setProfileForm({
          firstName: data.user.profile?.firstName || '',
          lastName: data.user.profile?.lastName || '',
          phone: data.user.profile?.phone || '',
          dateOfBirth: data.user.profile?.dateOfBirth ? 
            new Date(data.user.profile.dateOfBirth).toISOString().split('T')[0] : ''
        });
      } else {
        toast.error('Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch(`${backend_url}/api/user/orders`, {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserOrders(data.orders || []);
      } else {
        console.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        fetchUserData(); // Refresh data
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        toast.success('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="user-dashboard">
        <div className="error">Failed to load user data</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>My Account</h3>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Orders
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Security
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="tab-content">
              <div className="welcome-section">
                <h1>Welcome back, {userData.name}! </h1>
                <p>Here's an overview of your account activity</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{userData.stats.totalOrders}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-info">
                    <h3>{userData.stats.wishlistItems}</h3>
                    <p>Wishlist Items</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>{formatDate(userData.stats.accountSince)}</h3>
                    <p>Member Since</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('orders')}
                  >
                    View Orders
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => navigate('/wishlist')}
                  >
                    View Wishlist
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('profile')}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h1>Personal Information</h1>
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="disabled-input"
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm({...profileForm, dateOfBirth: e.target.value})}
                  />
                </div>

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h1>Order History</h1>
              <div className="orders-section">
                {userOrders.length === 0 ? (
                  <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <button 
                      className="action-btn"
                      onClick={() => navigate('/')}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {userOrders.map((order) => (
                      <div key={order.id} className="order-item">
                        <div className="order-header">
                          <div className="order-info">
                            <h3>Order #{order.id}</h3>
                            <p className="order-date">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-details">
                          <div className="product-info">
                            <div className="product-image-container">
                              <img 
                                src={`${backend_url}${order.product_image}`} 
                                alt={order.product_name}
                                className="product-image"
                                onError={(e) => {
                                  // Use a data URL for placeholder to avoid repeated requests
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAzNUg1NVY0NUgyNVYzNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDUwSDQ1VjU1SDMwVjUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                  e.target.onerror = null; // Prevent infinite loop
                                }}
                              />
                            </div>
                            <div className="product-details">
                              <h4>{order.product_name}</h4>
                              <p>Quantity: {order.quantity}</p>
                              <p>Product ID: {order.product_id}</p>
                            </div>
                          </div>
                          
                          <div className="order-total">
                            <h4>${order.total_price}</h4>
                            <p className="payment-method">
                              {order.payment_method === 'stripe' ? '💳 Card' : '💰 Manual'}
                            </p>
                          </div>
                        </div>
                        
                        {order.full_name && (
                          <div className="shipping-info">
                            <p><strong>Shipping to:</strong> {order.full_name}</p>
                            {order.address && <p>{order.address}, {order.city} {order.postal_code}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <h1>Account Security</h1>
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button type="submit" className="save-btn">
                  Change Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
