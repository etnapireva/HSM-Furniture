import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CSS/OrderSuccess.css";
import { backend_url, currency } from "../App";
import { ShopContext } from "../Context/ShopContext";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(ShopContext);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Clear cart when arriving at success page
    clearCart();
    
    const handleOrderSuccess = async () => {
      // Get order data from location state or sessionStorage (for Stripe redirects)
      const state = location.state;
      if (state && state.orderData) {
        setOrderData(state.orderData);
      } else {
        // Check if coming back from Stripe payment
        const urlParams = new URLSearchParams(location.search);
        const status = urlParams.get('status');
        
        if (status === 'success') {
          // Get order data from sessionStorage (stored before Stripe redirect)
          const storedOrderData = sessionStorage.getItem('pendingOrderData');
          if (storedOrderData) {
            const parsedData = JSON.parse(storedOrderData);
            
            // Try to save order to backend as fallback
            try {
              const token = localStorage.getItem("auth-token");
              if (token) {
                const response = await fetch(`${backend_url}/api/orders/save-stripe`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    items: parsedData.items.map(item => ({
                      product_id: item.id || item._id,
                      name: item.name,
                      amount: item.price,
                      quantity: item.quantity
                    })),
                    customer: parsedData.customer,
                    user_id: JSON.parse(atob(token.split('.')[1])).user.id,
                    session_id: 'manual-' + Date.now()
                  })
                });
                
                if (response.ok) {
                  console.log('✅ Order saved successfully via fallback');
                }
              }
            } catch (err) {
              console.error('❌ Failed to save order via fallback:', err);
            }
            
            setOrderData({
              ...parsedData,
              orderId: 'Stripe-' + Date.now(), // Generate a temporary ID
              message: "Payment completed successfully!"
            });
            sessionStorage.removeItem('pendingOrderData');
          } else {
            // Stripe payment completed but no sessionStorage data
            // This means the webhook processed successfully
            setOrderData({ 
              orderId: 'Stripe-' + Date.now(),
              message: "Payment completed successfully!",
              items: [],
              total: 0,
              customer: null
            });
          }
        } else {
          // Fallback for direct access
          setOrderData({ 
            orderId: 'Unknown',
            message: "Order placed successfully!" 
          });
        }
      }
    };

    handleOrderSuccess();
  }, [location, clearCart]);

  const handleContinueShopping = () => {
    navigate("/");
  };


  if (!orderData) {
    return (
      <div className="order-success">
        <div className="success-container">
          <h1>Loading order details...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1>Porosia u ruajt me sukses!</h1>
          <p className="success-message">
            Faleminderit për porosinë tuaj. Do të merrni një email konfirmimi së shpejti.
          </p>
          <div className="payment-confirmation">
            <p><strong>Pagesa u konfirmua me sukses!</strong></p>
            <p>Do të merrni një email konfirmim për porosinë tuaj.</p>
          </div>
        </div>

        <div className="order-details">
          <h2>Detajet e Porosisë</h2>
          
          {orderData.orderId && (
            <div className="order-info">
              <div className="info-row">
                <span className="label">Numri i Porosisë:</span>
                <span className="value">#{orderData.orderId}</span>
              </div>
            </div>
          )}

          {orderData.items && orderData.items.length > 0 && (
            <div className="order-items">
              <h3>Artikujt e Porositur</h3>
              {orderData.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img 
                    src={`${backend_url}${item.image}`} 
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Sasia: {item.quantity}</p>
                    <p>Çmimi: {currency}{item.price}</p>
                  </div>
                  <div className="item-total">
                    {currency}{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}

          {orderData.total && (
            <div className="order-summary">
              <div className="summary-row">
                <span>Nëntotali:</span>
                <span>{currency}{orderData.total}</span>
              </div>
              <div className="summary-row">
                <span>Transporti:</span>
                <span>Falas</span>
              </div>
              <div className="summary-row total">
                <span>Totali:</span>
                <span>{currency}{orderData.total}</span>
              </div>
            </div>
          )}

          {orderData.customer && (
            <div className="shipping-details">
              <h3>Adresa e Dërgesës</h3>
              <div className="shipping-info">
                <p><strong>{orderData.customer.fullName}</strong></p>
                <p>{orderData.customer.address}</p>
                <p>{orderData.customer.city}, {orderData.customer.postalCode}</p>
                <p>Tel: {orderData.customer.phone}</p>
                <p>Email: {orderData.customer.email}</p>
                {orderData.customer.note && (
                  <p><strong>Shënim:</strong> {orderData.customer.note}</p>
                )}
              </div>
            </div>
          )}

          <div className="next-steps">
            <h3>Hapat e Ardhshëm</h3>
            <ul>
              <li>✅ Pagesa u konfirmua me sukses përmes Stripe</li>
              <li>📧 Do të merrni një email konfirmimi brenda 5 minutave</li>
              <li>📞 Do të kontaktoheni për detajet e dërgesës</li>
              <li>🚚 Porosia do të dërgohet brenda 2-3 ditëve të punës</li>
            </ul>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn btn-primary" 
            onClick={handleContinueShopping}
          >
            Vazhdo Blerjen
          </button>
        </div>
      </div>
    </div>
  );
}
