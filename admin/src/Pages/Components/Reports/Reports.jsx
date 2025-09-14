import React, { useState, useEffect } from 'react';
import './Reports.css';
import { useAdminUser } from '../../Context/AdminUserContext';
import { backend_url } from '../../config';

const Reports = () => {
  const { adminUser } = useAdminUser();
  const [activeTab, setActiveTab] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  // Set default dates (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  const generateReport = async (reportType = activeTab) => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      let url = `${backend_url}/api/reports/${reportType}?startDate=${startDate}&endDate=${endDate}`;
      
      if (exportFormat !== 'json') {
        url += `&format=${exportFormat}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (exportFormat === 'json') {
        const data = await response.json();
        setReportData(data);
      } else {
        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      console.error('Error details:', error.message);
      if (error.message.includes('Unexpected token')) {
        alert('Server returned invalid response. Please check if the backend is running on port 4001.');
      } else {
        alert('Error generating report. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSalesReport = () => {
    if (!reportData || !reportData.summary || !reportData.dailyTrends || !reportData.detailedOrders) return null;

    return (
      <div className="report-content">
        <div className="report-summary">
          <h3>Sales Summary</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <h4>Total Revenue</h4>
              <p>{reportData.summary.totalRevenue}</p>
            </div>
            <div className="summary-card">
              <h4>Total Orders</h4>
              <p>{reportData.summary.totalOrders}</p>
            </div>
            <div className="summary-card">
              <h4>Total Items</h4>
              <p>{reportData.summary.totalItems}</p>
            </div>
            <div className="summary-card">
              <h4>Period</h4>
              <p>{reportData.summary.period.start} to {reportData.summary.period.end}</p>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h3>Daily Trends</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {reportData.dailyTrends.map((day, index) => (
                  <tr key={index}>
                    <td>{day.date}</td>
                    <td>{day.revenue}</td>
                    <td>{day.orders}</td>
                    <td>{day.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="report-section">
          <h3>Detailed Orders</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Revenue</th>
                  <th>Customer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.detailedOrders.slice(0, 20).map((order, index) => (
                  <tr key={index}>
                    <td>{order.date}</td>
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>
                    <td>{order.total_price}</td>
                    <td>{order.user_name}</td>
                    <td>{order.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.detailedOrders.length > 20 && (
              <p className="table-note">Showing first 20 orders. Export to see all data.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProductReport = () => {
    if (!reportData || !reportData.summary || !reportData.productDetails) return null;

    return (
      <div className="report-content">
        <div className="report-summary">
          <h3>Product Performance Summary</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <h4>Total Products</h4>
              <p>{reportData.summary.totalProducts}</p>
            </div>
            <div className="summary-card">
              <h4>Total Revenue</h4>
              <p>{reportData.summary.totalRevenue}</p>
            </div>
            <div className="summary-card">
              <h4>Total Orders</h4>
              <p>{reportData.summary.totalOrders}</p>
            </div>
            <div className="summary-card">
              <h4>Total Quantity Sold</h4>
              <p>{reportData.summary.totalQuantitySold}</p>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h3>Product Details</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Total Orders</th>
                  <th>Quantity Sold</th>
                  <th>Total Revenue</th>
                  <th>Average Order Value</th>
                  <th>First Order</th>
                  <th>Last Order</th>
                </tr>
              </thead>
              <tbody>
                {reportData.productDetails.map((product, index) => (
                  <tr key={index}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.totalOrders}</td>
                    <td>{product.totalQuantitySold}</td>
                    <td>{product.totalRevenue}</td>
                    <td>{product.averageOrderValue}</td>
                    <td>{product.firstOrderDate}</td>
                    <td>{product.lastOrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeTab) {
      case 'sales':
        return renderSalesReport();
      case 'products':
        return renderProductReport();
      default:
        return null;
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Dynamic Reports & Analytics</h2>
      </div>

      <div className="reports-controls">
        <div className="date-controls">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="export-controls">
          <div className="form-group">
            <label>Export Format:</label>
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="json">View in Browser</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          
          <button 
            className="generate-btn"
            onClick={() => generateReport()}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="reports-tabs">
        <button 
          className={`tab ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('sales');
            setReportData(null); // Clear previous report data
          }}
        >
          Sales Reports
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('products');
            setReportData(null); // Clear previous report data
          }}
        >
          Product Performance
        </button>
      </div>

      <div className="reports-content">
        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reports;
