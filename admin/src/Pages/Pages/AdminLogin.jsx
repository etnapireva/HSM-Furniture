import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../config';
import './CSS/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in and is admin
    const token = localStorage.getItem('auth-token');
    if (token) {
      checkAdminStatus();
    }
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${backend_url}/admin/check`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin) {
          navigate('/admin');
        }
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Login to get the token
      const loginResponse = await fetch(`${backend_url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginData.success) {
        // Step 2: Store the token
        localStorage.setItem('auth-token', loginData.accessToken);
        
        // Step 3: Check if user is admin
        const adminCheckResponse = await fetch(`${backend_url}/admin/check`, {
          headers: {
            'auth-token': loginData.accessToken
          }
        });
        
        if (adminCheckResponse.ok) {
          const adminData = await adminCheckResponse.json();
          
          if (adminData.isAdmin) {
            navigate('/admin');
          } else {
            setError('Access denied. Admin privileges required.');
            localStorage.removeItem('auth-token');
          }
        } else {
          setError('Failed to verify admin status.');
          localStorage.removeItem('auth-token');
        }
      } else {
        setError(loginData.errors || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have admin access? Contact your administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
