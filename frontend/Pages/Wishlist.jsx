import React from 'react';
import { useWishlist } from '../Context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { backend_url, currency } from '../App';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist, getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleRemoveFromWishlist = (e, productId) => {
    e.stopPropagation(); // Prevent navigation when clicking remove button
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>Save your favorite items for later</p>
        </div>
        
        <div className="wishlist-empty">
          <div className="empty-icon">💝</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding items you love to your wishlist!</p>
          <button 
            className="browse-products-btn"
            onClick={() => navigate('/')}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="wishlist-title">
          <h1>My Wishlist</h1>
          <span className="wishlist-count">({getWishlistCount()} items)</span>
        </div>
        <button 
          className="clear-wishlist-btn"
          onClick={handleClearWishlist}
        >
          Clear All
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div 
            key={product._id || product.id} 
            className="wishlist-item"
            onClick={() => handleProductClick(product._id || product.id)}
          >
            <div className="wishlist-item-image">
              <img 
                src={`${backend_url}${product.image}`} 
                alt={product.name}
                loading="lazy"
              />
              <button 
                className="remove-from-wishlist-btn"
                onClick={(e) => handleRemoveFromWishlist(e, product._id || product.id)}
                title="Remove from wishlist"
              >
                ❤️
              </button>
            </div>
            
            <div className="wishlist-item-details">
              <h3 className="wishlist-item-name">{product.name}</h3>
              
              <div className="wishlist-item-specs">
                {product.color && (
                  <div className="wishlist-spec">
                    <span className="spec-label">Color:</span>
                    <span className="spec-value">{product.color}</span>
                  </div>
                )}
                {product.material && (
                  <div className="wishlist-spec">
                    <span className="spec-label">Material:</span>
                    <span className="spec-value">{product.material}</span>
                  </div>
                )}
                {product.size && (
                  <div className="wishlist-spec">
                    <span className="spec-label">Size:</span>
                    <span className="spec-value">{product.size}</span>
                  </div>
                )}
              </div>
              
              <div className="wishlist-item-price">
                {product.price ? `${currency}${product.price}` : "N/A"}
              </div>
              
              <div className="wishlist-item-actions">
                <button 
                  className="view-product-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product._id || product.id);
                  }}
                >
                  View Product
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
