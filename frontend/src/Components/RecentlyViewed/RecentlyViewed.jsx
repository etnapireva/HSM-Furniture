import React, { useState, useEffect } from 'react';
import './RecentlyViewed.css';
import { Link } from 'react-router-dom';
import { currency } from '../../config';
import { imageUrl } from '../../config';
import { cartKey } from '../../config';
import { useWishlist } from '../../Context/WishlistContext';

const STORAGE_KEY = 'recentlyViewed';
const UPDATE_EVENT = 'recently-viewed-updated';

function slimProduct(product) {
  if (!product) return null;
  return {
    id: product.id,
    _id: product._id,
    name: product.name,
    image: product.image,
    images: product.images,
    price: product.price,
    prodhimi: product.prodhimi,
    color: product.color,
    category: product.category,
  };
}

export function rememberViewedProduct(product, maxItems = 8) {
  const next = slimProduct(product);
  if (!next) return [];

  const productId = cartKey(next);
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    list = [];
  }

  const updated = [next, ...list.filter((item) => cartKey(item) !== productId)].slice(0, maxItems);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(UPDATE_EVENT));
  return updated;
}

const RecentlyViewed = ({ maxItems = 5, excludeId }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const hiddenId = excludeId != null ? String(excludeId) : '';

  const loadViewed = () => {
    try {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const filtered = hiddenId
        ? products.filter((item) => cartKey(item) !== hiddenId)
        : products;
      setRecentlyViewed(filtered.slice(0, maxItems));
    } catch (error) {
      console.error('Error parsing recently viewed products:', error);
    }
  };

  useEffect(() => {
    loadViewed();
    window.addEventListener(UPDATE_EVENT, loadViewed);
    window.addToRecentlyViewed = rememberViewedProduct;
    return () => {
      window.removeEventListener(UPDATE_EVENT, loadViewed);
      delete window.addToRecentlyViewed;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxItems, hiddenId]);

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
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new Event(UPDATE_EVENT));
          }}
          title="Fshi të gjitha"
        >
          Fshi Të Gjitha
        </button>
      </div>
      
      <div className="recently-viewed-grid">
        {recentlyViewed.map((product) => {
          const productId = cartKey(product);
          
          return (
            <div key={productId} className="recent-item">
              <Link to={`/product/${productId}`} className="recent-item-link">
                <div className="recent-item-image">
                  <img 
                    src={imageUrl(product.image || product.images)} 
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
                    {product.price ? `${product.price} ${currency}` : "N/A"}
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
