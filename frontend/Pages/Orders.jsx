import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Orders.css";
import { backend_url, currency } from "../App";
import { authenticatedFetch } from "../utils/authUtils";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`${backend_url}/user/orders`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const data = await response.json();
      setOrders(data.orders);
      setGroupedOrders(data.groupedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Në Pritje';
      case 'processing': return 'Në Procesim';
      case 'shipped': return 'Dërguar';
      case 'delivered': return 'Dërguar';
      case 'cancelled': return 'Anuluar';
      default: return 'E Panjohur';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Në Pritje';
      case 'completed': return 'Paguar';
      case 'failed': return 'Dështuar';
      default: return 'E Panjohur';
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading">
            <h2>Duke ngarkuar porositë...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="error">
            <h2>Gabim gjatë ngarkimit të porosive</h2>
            <p>{error}</p>
            <button onClick={fetchUserOrders} className="retry-btn">
              Provo Përsëri
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>Nuk keni porosi ende</h2>
            <p>Porositë tuaja do të shfaqen këtu pasi të bëni blerjen e parë.</p>
            <button onClick={() => navigate("/shop")} className="shop-btn">
              Filloni të Blini
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>Porositë e Mia</h1>
          <p>Gjithsej {orders.length} porosi</p>
        </div>

        <div className="orders-list">
          {Object.entries(groupedOrders).map(([date, dateOrders]) => (
            <div key={date} className="order-group">
              <h3 className="order-date">{date}</h3>
              {dateOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h4>Porosia #{order.id}</h4>
                      <p className="order-time">
                        {new Date(order.created_at).toLocaleTimeString('sq-AL')}
                      </p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="product-info">
                      <h5>{order.product_name}</h5>
                      <p>Sasia: {order.quantity}</p>
                      <p>Çmimi: {currency}{order.total_price}</p>
                    </div>
                    
                    <div className="payment-info">
                      <p><strong>Pagesa:</strong> {getPaymentStatusText(order.payment_status)}</p>
                      <p><strong>Metoda:</strong> {order.payment_method === 'manual' ? 'Manual' : 'Kartë'}</p>
                    </div>
                  </div>

                  {order.full_name && (
                    <div className="shipping-info">
                      <h6>Adresa e Dërgesës:</h6>
                      <p>{order.full_name}</p>
                      <p>{order.address}, {order.city} {order.postal_code}</p>
                      <p>Tel: {order.phone}</p>
                      {order.note && <p><em>Shënim: {order.note}</em></p>}
                    </div>
                  )}

                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      Shiko Detajet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="orders-footer">
          <button onClick={() => navigate("/shop")} className="continue-shopping-btn">
            Vazhdo Blerjen
          </button>
        </div>
      </div>
    </div>
  );
}
