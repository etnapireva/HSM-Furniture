import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:4001', { 
      withCredentials: true,
      autoConnect: true 
    });

    newSocket.on('connect', () => {
      console.log('Frontend connected to notification server');
      console.log('🔌 Socket ID:', newSocket.id);
      setIsConnected(true);
    });

    // Add a catch-all listener to see if we're receiving any events (for debugging)
    newSocket.onAny((eventName, ...args) => {
      if (eventName === 'stock:alert') {
        console.log('📡 Received stock alert event:', args);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from notification server');
      setIsConnected(false);
    });

    // Listen for different types of notifications
    newSocket.on('order:new', (data) => {
      console.log('🆕 New order notification:', data);
      addNotification(data);
      toast.success(`New order #${data.order_id} received!`, {
        duration: 5000,
        icon: '🛒',
      });
    });

    newSocket.on('order:confirmed', (data) => {
      console.log('✅ Order confirmed notification:', data);
      addNotification(data);
      toast.success(`Order #${data.order_id} confirmed!`, {
        duration: 4000,
        icon: '✅',
      });
    });

    newSocket.on('order:status_updated', (data) => {
      console.log('📦 Order status update:', data);
      addNotification(data);
      toast.success(`Order #${data.order_id} status: ${data.status}`, {
        duration: 4000,
        icon: '📦',
      });
    });

    newSocket.on('stock:alert', (data) => {
      console.log('⚠️ Stock alert received:', data);
      addNotification(data);
      toast.error(`Low stock alert: Product ${data.product_id}`, {
        duration: 6000,
        icon: '⚠️',
      });
    });

    newSocket.on('price:drop', (data) => {
      console.log('💰 Price drop notification:', data);
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
    const notificationWithRead = {
      ...notification,
      read: false // Add read property
    };
    setNotifications(prev => [notificationWithRead, ...prev.slice(0, 49)]); // Keep last 50 notifications
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const joinAdminRoom = () => {
    if (socket && isConnected) {
      socket.emit('join-admin');
      console.log('👨‍💼 Joining admin room...');
    }
  };

  const joinUserRoom = (userId) => {
    if (socket && isConnected) {
      socket.emit('join-user', userId);
      console.log(`👤 Joining user room for ${userId}...`);
    }
  };

  const value = {
    socket,
    notifications,
    isConnected,
    addNotification,
    clearNotifications,
    removeNotification,
    joinAdminRoom,
    joinUserRoom
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
