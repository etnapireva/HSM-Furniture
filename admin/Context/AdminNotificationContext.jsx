import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const AdminNotificationContext = createContext();

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationProvider');
  }
  return context;
};

export const AdminNotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(
      process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:4001',
      { 
      withCredentials: true,
      autoConnect: true 
    });

    newSocket.on('connect', () => {
      console.log('🔌 Admin connected to notification server');
      setIsConnected(true);
      
      // Join admin room immediately
      newSocket.emit('join-admin');
      console.log('👨‍💼 Admin joined admin room');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Admin disconnected from notification server');
      setIsConnected(false);
    });

    // Listen for admin-specific notifications
    newSocket.on('order:new', (data) => {
      console.log('🆕 New order notification (admin):', data);
      addNotification(data);
      toast.success(`New order #${data.order_id} received!`, {
        duration: 5000,
        icon: '🛒',
      });
    });

    newSocket.on('order:status_changed', (data) => {
      console.log('📦 Order status changed (admin):', data);
      addNotification(data);
      toast.info(`Order #${data.order_id} status changed to: ${data.status}`, {
        duration: 4000,
        icon: '📦',
      });
    });

    newSocket.on('admin:stock_alert', (data) => {
      console.log('⚠️ Stock alert (admin):', data);
      console.log('📝 Adding admin stock alert to notifications array');
      addNotification(data);
      toast.error(`Low stock alert: Product ${data.product_id}`, {
        duration: 6000,
        icon: '⚠️',
      });
    });

    newSocket.on('price:drop', (data) => {
      console.log('💰 Price drop notification (admin):', data);
      addNotification(data);
      toast.success(`Price drop! ${data.discount_percentage}% off!`, {
        duration: 5000,
        icon: '💰',
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addNotification = (notification) => {
    console.log('📝 Admin addNotification called with:', notification);
    setNotifications(prev => {
      const newNotifications = [notification, ...prev.slice(0, 49)];
      console.log('📝 Admin notifications array updated, total count:', newNotifications.length);
      return newNotifications;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const joinAdminRoom = () => {
    if (socket) {
      socket.emit('join-admin');
      console.log('👨‍💼 Admin joined admin room');
    }
  };

  const value = {
    socket,
    notifications,
    isConnected,
    addNotification,
    clearNotifications,
    removeNotification,
    joinAdminRoom
  };

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
};

