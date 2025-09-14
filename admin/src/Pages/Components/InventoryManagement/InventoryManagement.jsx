import React, { useState, useEffect } from 'react';
import './InventoryManagement.css';
import { backend_url } from '../../config';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ stock: '', minStock: '', maxStock: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      console.log('🔍 Fetching inventory...');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Backend URL:', backend_url);
      
      const response = await fetch(`${backend_url}/admin/inventory`, {
        headers: {
          'auth-token': token
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Inventory data:', data);
        setInventory(data.inventory);
        setSummary(data.summary);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch inventory:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/admin/inventory/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        setEditingProduct(null);
        fetchInventory(); // Refresh inventory
        alert('Stock updated successfully!');
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock');
    }
  };

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return <span className="status-badge out-of-stock">Out of Stock</span>;
    } else if (status === 'low') {
      return <span className="status-badge low-stock">Low Stock</span>;
    } else {
      return <span className="status-badge in-stock">In Stock</span>;
    }
  };

  if (loading) {
    return <div className="inventory-loading">Loading inventory...</div>;
  }

  console.log('🔍 Render state:', { loading, inventory: inventory.length, summary });

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h2>📦 Inventory Management</h2>
        <div className="inventory-summary">
          <div className="summary-card">
            <h3>{summary.totalProducts}</h3>
            <p>Total Products</p>
          </div>
          <div className="summary-card low-stock">
            <h3>{summary.lowStock}</h3>
            <p>Low Stock</p>
          </div>
          <div className="summary-card out-of-stock">
            <h3>{summary.outOfStock}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Collection</th>
              <th>Current Stock</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Min Stock</th>
              <th>Max Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((product) => (
              <tr key={product.id} className={product.status === 'low' ? 'low-stock-row' : ''}>
                <td>
                  <div className="product-info">
                    <img 
                      src={`http://localhost:4001${product.image}`} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="product-placeholder" style={{display: 'none'}}>
                      📦
                    </div>
                    <div className="product-details">
                      <span className="product-name">{product.name}</span>
                    </div>
                  </div>
                </td>
                <td>{product.collection}</td>
                <td>{product.stock}</td>
                <td>{product.reserved}</td>
                <td>{product.available}</td>
                <td>{product.minStock}</td>
                <td>{product.maxStock}</td>
                <td>{getStatusBadge(product.status, product.stock)}</td>
                <td>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Stock: {editingProduct.name}</h3>
            <div className="edit-form">
              <div className="form-group">
                <label>Current Stock:</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Minimum Stock:</label>
                <input
                  type="number"
                  value={editForm.minStock}
                  onChange={(e) => setEditForm({...editForm, minStock: e.target.value})}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Maximum Stock:</label>
                <input
                  type="number"
                  value={editForm.maxStock}
                  onChange={(e) => setEditForm({...editForm, maxStock: e.target.value})}
                  min="0"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
