import React, { useState, useEffect } from 'react';
import './RecentlyViewed.css';
import { Link } from 'react-router-dom';
import { backend_url, currency } from '../../App';
import { useWishlist } from '../../Context/WishlistContext';

const RecentlyViewed = ({ maxItems = 5 }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Load recently viewed products from localStorage
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        const products = JSON.parse(stored);
        setRecentlyViewed(products.slice(0, maxItems));
      } catch (error) {
        console.error('Error parsing recently viewed products:', error);
      }
    }
  }, [maxItems]);

  // Function to add product to recently viewed (called from other components)
  const addToRecentlyViewed = (product) => {
    const productId = product._id || product.id;
    
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => (p._id || p.id) !== productId);
      // Add to beginning
      const updated = [product, ...filtered].slice(0, maxItems);
      
      // Save to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      
      return updated;
    });
  };

  // Expose the function globally so other components can use it
  useEffect(() => {
    window.addToRecentlyViewed = addToRecentlyViewed;
    return () => {
      delete window.addToRecentlyViewed;
    };
  }, []);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="recently-viewed">
      <div className="recently-viewed-header">
        <h3>Produktet e Shikuara Së Fundmi</h3>
        <button 
          className="clear-recent-btn"
          onClick={() => {
            setRecentlyViewed([]);
            localStorage.removeItem('recentlyViewed');
          }}
          title="Fshi të gjitha"
        >
          Fshi Të Gjitha
        </button>
      </div>
      
      <div className="recently-viewed-grid">
        {recentlyViewed.map((product) => {
          const productId = product._id || product.id;
          
          return (
            <div key={productId} className="recent-item">
              <Link to={`/product/${productId}`} className="recent-item-link">
                <div className="recent-item-image">
                  <img 
                    src={`${backend_url}${product.image}`} 
                    alt={product.name}
                    loading="lazy"
                  />
                  <button 
                    className={`recent-wishlist-btn ${isInWishlist(productId) ? 'in-wishlist' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isInWishlist(productId)) {
                        removeFromWishlist(productId);
                      } else {
                        addToWishlist(product);
                      }
                    }}
                    title={isInWishlist(productId) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isInWishlist(productId) ? '❤️' : '🤍'}
                  </button>
                </div>
                
                <div className="recent-item-details">
                  <h4 className="recent-item-name">{product.name}</h4>
                  
                  <div className="recent-item-specs">
                    {product.prodhimi && (
                      <div className="recent-spec">
                        <span className="recent-spec-label">Prodhimi:</span>
                        <span className="recent-spec-value">{product.prodhimi}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="recent-spec">
                        <span className="recent-spec-label">Ngjyra:</span>
                        <span className="recent-spec-value">{product.color}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="recent-item-price">
                    {product.price ? `${currency}${product.price}` : "N/A"}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewed;
