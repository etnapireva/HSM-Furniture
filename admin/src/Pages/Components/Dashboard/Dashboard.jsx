import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { backend_url } from "../../config";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      
      const token = localStorage.getItem('auth-token');
      
      // Fetch orders from your backend
      const ordersResponse = await fetch(`${backend_url}/admin/orders`, {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      const ordersData = await ordersResponse.json();
      console.log("Orders data:", ordersData);
      
      // Fetch products from MongoDB
      const productsResponse = await fetch(`${backend_url}/admin/products`, {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      const productsData = await productsResponse.json();
      console.log("Products data:", productsData);
      
      // Calculate stats
      const totalOrders = ordersData.total_orders || 0;
      const totalProducts = productsData.total_products || 0;
      const totalRevenue = ordersData.orders?.reduce((sum, order) => sum + parseFloat(order.total_price), 0) || 0;
      const recentOrders = ordersData.orders?.slice(0, 5) || [];

      console.log("Calculated stats:", { totalOrders, totalProducts, totalRevenue });

      setStats({
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue.toFixed(2),
        recentOrders
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">€{stats.totalRevenue}</p>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.product_id}</td>
                  <td>{order.quantity}</td>
                  <td>€{order.total_price}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
