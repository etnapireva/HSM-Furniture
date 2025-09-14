import React, { useState, useEffect } from "react";
import { backend_url } from "../../config";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/admin/orders`, {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log("Orders data received:", data.orders);
      
      // Log user information for debugging
      if (data.orders && data.orders.length > 0) {
        console.log("User information in orders:");
        data.orders.forEach((order, index) => {
          console.log(`Order ${index + 1}:`, {
            orderId: order.id,
            userId: order.user_id,
            userName: order.user_name,
            userEmail: order.user_email
          });
        });
      }
      
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.product_id.toString().includes(searchTerm) ||
      order.user_id.toString().includes(searchTerm) ||
      (order.user_name && order.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user_email && order.user_email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        // Show success message
        alert(`Order #${orderId} status updated to: ${newStatus}`);
      } else {
        const errorData = await response.json();
        alert(`Error updating status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="order-management">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="order-header">
        <h1>Order Management</h1>
        <button onClick={fetchOrders} className="refresh-btn">
          Refresh Orders
        </button>
      </div>

      <div className="order-controls">
                <div className="search-box">
          <input
            type="text"
            placeholder="Search by Order ID, Product Name, Customer Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-summary">
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>€{orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0).toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Filtered Orders</h3>
          <p>{filteredOrders.length}</p>
        </div>
      </div>

      <div className="orders-table-container">
                <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Customer Info</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Payment Status</th>
              <th>Current Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.product_name || 'N/A'}</td>
                <td className="customer-info">
                  <div className="customer-name">
                    {order.user_name || 'Unknown User'}
                  </div>
                  {order.user_email && (
                    <div className="customer-email">
                      {order.user_email}
                    </div>
                  )}
                  <div className="customer-id">
                    ID: {order.user_id}
                  </div>
                </td>
                <td>{order.quantity}</td>
                <td>€{order.total_price}</td>
                <td>
                  <span className={`payment-status ${order.payment_status}`}>
                    {order.payment_status || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className={`order-status ${order.status || 'pending'}`}>
                    {order.status || 'pending'}
                  </span>
                </td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <select 
                    value={order.status || 'pending'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                    disabled={updatingStatus[order.id]}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingStatus[order.id] && (
                    <span className="updating-indicator">Updating...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
