import React, { createContext, useContext, useState, useEffect } from 'react';
import { backend_url } from '../config';

const AdminUserContext = createContext();

export const useAdminUser = () => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error('useAdminUser must be used within an AdminUserProvider');
  }
  return context;
};

export const AdminUserProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch admin user if we're already on an admin page (not login page)
    // This prevents automatic login when accessing admin login page
    const currentPath = window.location.pathname;
    if (currentPath !== '/admin/login') {
      fetchAdminUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdminUser = async () => {
    const token = localStorage.getItem('auth-token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend_url}/admin/check`, {
        headers: {
          'auth-token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin && data.user) {
          setAdminUser(data.user);
        }
      }
    } catch (err) {
      console.error('Error fetching admin user:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAdminUser = () => {
    setAdminUser(null);
  };

  const value = {
    adminUser,
    loading,
    fetchAdminUser,
    clearAdminUser
  };

  return (
    <AdminUserContext.Provider value={value}>
      {children}
    </AdminUserContext.Provider>
  );
};
