import React, { createContext, useContext, useState, useEffect } from 'react';
import { backend_url } from '../App';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in and load wishlist
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      // Load from server
      loadWishlistFromServer();
    } else {
      // Load from localStorage for guests
      loadWishlistFromLocal();
    }
  }, []);

  // Load wishlist from server
  const loadWishlistFromServer = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;
      
      const response = await fetch(`${backend_url}/user/wishlist`, {
        headers: {
          'auth-token': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error('Error loading wishlist from server:', error);
      // Fallback to local storage
      loadWishlistFromLocal();
    }
  };

  // Load wishlist from localStorage
  const loadWishlistFromLocal = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        setWishlist([]);
      }
    }
  };

  // Save wishlist to localStorage for guests
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoggedIn]);

  const addToWishlist = async (product) => {
    setIsLoading(true);
    
    // Check if product is already in wishlist
    const isAlreadyInWishlist = wishlist.some(item => 
      item._id === product._id || item.id === product.id || item.productId === (product._id || product.id)
    );

    if (isAlreadyInWishlist) {
      showNotification('Product is already in your wishlist!', 'info');
      setIsLoading(false);
      return;
    }

    const productToAdd = {
      _id: product._id || product.id,
      id: product._id || product.id,
      productId: product._id || product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      color: product.color,
      material: product.material,
      size: product.size,
      prodhimi: product.prodhimi,
      addedAt: new Date().toISOString()
    };

    if (isLoggedIn) {
      // Add to server
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch(`${backend_url}/user/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({
            productId: productToAdd.productId,
            productData: productToAdd
          })
        });

        if (response.ok) {
          const data = await response.json();
          setWishlist(data.wishlist || []);
          showNotification('Product added to wishlist!', 'success');
        } else {
          throw new Error('Failed to add to server wishlist');
        }
      } catch (error) {
        console.error('Error adding to server wishlist:', error);
        // Fallback to local storage
        setWishlist(prev => [...prev, productToAdd]);
        showNotification('Product added to wishlist!', 'success');
      }
    } else {
      // Add to local storage
      setWishlist(prev => [...prev, productToAdd]);
      showNotification('Product added to wishlist!', 'success');
    }
    
    setIsLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    setIsLoading(true);
    
    if (isLoggedIn) {
      // Remove from server
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch(`${backend_url}/user/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'auth-token': token
          }
        });

        if (response.ok) {
          const data = await response.json();
          setWishlist(data.wishlist || []);
          showNotification('Product removed from wishlist!', 'success');
        } else {
          throw new Error('Failed to remove from server wishlist');
        }
      } catch (error) {
        console.error('Error removing from server wishlist:', error);
        // Fallback to local storage
        setWishlist(prev => prev.filter(item => 
          item._id !== productId && item.id !== productId && item.productId !== productId
        ));
        showNotification('Product removed from wishlist!', 'success');
      }
    } else {
      // Remove from local storage
      setWishlist(prev => prev.filter(item => 
        item._id !== productId && item.id !== productId && item.productId !== productId
      ));
      showNotification('Product removed from wishlist!', 'success');
    }
    
    setIsLoading(false);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => 
      item._id === productId || item.id === productId || item.productId === productId
    );
  };

  const clearWishlist = async () => {
    setIsLoading(true);
    
    if (isLoggedIn) {
      // Clear from server
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch(`${backend_url}/user/wishlist`, {
          method: 'DELETE',
          headers: {
            'auth-token': token
          }
        });

        if (response.ok) {
          setWishlist([]);
          showNotification('Wishlist cleared!', 'success');
        } else {
          throw new Error('Failed to clear server wishlist');
        }
      } catch (error) {
        console.error('Error clearing server wishlist:', error);
        // Fallback to local storage
        setWishlist([]);
        showNotification('Wishlist cleared!', 'success');
      }
    } else {
      // Clear from local storage
      setWishlist([]);
      showNotification('Wishlist cleared!', 'success');
    }
    
    setIsLoading(false);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Simple notification system
  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `wishlist-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(10px)'
    });

    // Set background color based on type
    switch (type) {
      case 'success':
        notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        break;
      case 'error':
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        break;
      case 'info':
        notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        break;
      default:
        notification.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Function to sync local wishlist to server when user logs in
  const syncLocalWishlistToServer = async () => {
    if (!isLoggedIn) return;
    
    const localWishlist = localStorage.getItem('wishlist');
    if (!localWishlist) return;
    
    try {
      const localItems = JSON.parse(localWishlist);
      const token = localStorage.getItem('auth-token');
      
      // Add each local item to server
      for (const item of localItems) {
        try {
          await fetch(`${backend_url}/user/wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token
            },
            body: JSON.stringify({
              productId: item.productId || item._id || item.id,
              productData: item
            })
          });
        } catch (error) {
          console.error('Error syncing item to server:', error);
        }
      }
      
      // Clear local storage after successful sync
      localStorage.removeItem('wishlist');
      
      // Reload wishlist from server
      await loadWishlistFromServer();
    } catch (error) {
      console.error('Error syncing wishlist to server:', error);
    }
  };

  // Listen for login events
  useEffect(() => {
    const handleTokenUpdate = () => {
      const token = localStorage.getItem('auth-token');
      const wasLoggedIn = isLoggedIn;
      const nowLoggedIn = !!token;
      
      setIsLoggedIn(nowLoggedIn);
      
      if (!wasLoggedIn && nowLoggedIn) {
        // User just logged in - sync local wishlist to server
        syncLocalWishlistToServer();
      } else if (wasLoggedIn && !nowLoggedIn) {
        // User just logged out - load from local storage
        loadWishlistFromLocal();
      } else if (nowLoggedIn) {
        // User is logged in - load from server
        loadWishlistFromServer();
      }
    };

    // Listen for token updates
    window.addEventListener('tokenUpdated', handleTokenUpdate);
    
    return () => {
      window.removeEventListener('tokenUpdated', handleTokenUpdate);
    };
  }, [isLoggedIn]);

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    isLoading,
    isLoggedIn
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
