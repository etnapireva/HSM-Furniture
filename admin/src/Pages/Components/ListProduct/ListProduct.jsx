import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from '../Assets/cross_icon.png'
import { backend_url, currency } from "../../config";
import toast, { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(backend_url);
    setSocket(newSocket);

    // Listen for product deletion notifications
    newSocket.on('product:deleted', (data) => {
      toast.success(`Product deleted successfully!`, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
        icon: '✅',
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching products from:", `${backend_url}/admin/products`);
      
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/admin/products`, {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received data:", data);
      
      // Use the products array from the admin endpoint
      const transformedData = data.products || [];
      setAllProducts(transformedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const removeProduct = async (collection, id) => {
    try {
      console.log("Attempting to delete product:");
      console.log("- Collection:", collection);
      console.log("- ID:", id);
      console.log("- URL:", `${backend_url}/admin/deleteproduct/${collection}/${id}`);
      
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/admin/deleteproduct/${collection}/${id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      console.log("Delete response status:", response.status);
      console.log("Delete response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("Delete response data:", data);
        
        // Show success notification
        toast.success(`Product "${allproducts.find(p => p._id === id)?.name || 'Unknown'}" deleted successfully!`, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: '#fff',
          },
          icon: '✅',
        });
        
        fetchInfo(); // Refresh the list
      } else {
        const errorData = await response.text();
        console.error("Delete failed. Status:", response.status);
        console.error("Error response:", errorData);
        
        // Show error notification
        toast.error('Failed to remove product', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
          },
          icon: '❌',
        });
      }
    } catch (error) {
      console.error("Error removing product:", error);
      
      // Show error notification
      toast.error('Error removing product', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
        icon: '❌',
      });
    }
  }

  // Function to get image source with proper fallback
  const getImageSrc = (product) => {
    if (product.image && product.image !== "/images/placeholder.jpg") {
      // If image exists and is not placeholder, use backend URL
      return `${backend_url}${product.image}`;
    }
    // Return a data URI for a simple placeholder
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
  }

  if (loading) {
    return (
      <div className="listproduct">
        <div className="loading">Loading products...</div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listproduct">
        <div className="error">
          <h2>Error loading products</h2>
          <p>{error}</p>
          <button onClick={fetchInfo}>Try Again</button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="listproduct">
      <Toaster />
      <h1>All Products List ({allproducts.length} products)</h1>
      <div className="listproduct-format-main">
        <p>Image</p>
        <p>Name</p>
        <p>Price</p>
        <p>Color</p>
        <p>Material</p>
        <p>Size</p>
        <p>Collection</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={product._id || index}>
            <div className="listproduct-format-main listproduct-format">
              <img 
                className="listproduct-product-icon" 
                src={getImageSrc(product)}
                alt={product.name}
                onError={(e) => {
                  // Fallback to data URI if image fails to load
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                }}
              />
              <p className="cartitems-product-title">{product.name}</p>
              <p>{currency}{product.price}</p>
              <p>{product.color || 'N/A'}</p>
              <p>{product.material || 'N/A'}</p>
              <p>{product.size || 'N/A'}</p>
              <p>{product.collection}</p>
              <img 
                className="listproduct-remove-icon" 
                onClick={() => removeProduct(product.collection, product._id)} 
                src={cross_icon} 
                alt="Remove"
              />
            </div>
            <hr />
          </div>
        ))}
      </div>
      {allproducts.length === 0 && (
        <div className="no-products">
          <p>No products found.</p>
          <p>Make sure your backend is running and MongoDB is connected.</p>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
