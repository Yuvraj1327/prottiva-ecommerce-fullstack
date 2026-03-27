import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingCart, Settings } from 'lucide-react';

// Import your sub-components (or define them below)
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import OrderManagement from './components/OrderManagement';
import BackendControl from './components/BackendControl';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        
        {/* Sidebar Navigation */}
        <nav style={styles.sidebar}>
          <h2 style={styles.logo}>Admin Panel</h2>
          <ul style={styles.navList}>
            <li>
              <Link to="/" style={styles.navLink}><LayoutDashboard size={20} /> Dashboard</Link>
            </li>
            <li>
              <Link to="/add-product" style={styles.navLink}><PackagePlus size={20} /> Add Products</Link>
            </li>
            <li>
              <Link to="/orders" style={styles.navLink}><ShoppingCart size={20} /> Manage Orders</Link>
            </li>
            <li>
              <Link to="/control" style={styles.navLink}><Settings size={20} /> Backend Control</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main style={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/control" element={<BackendControl />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
};

// Simple inline styles for a quick setup
const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  logo: {
    fontSize: '1.5rem',
    marginBottom: '30px',
    borderBottom: '1px solid #34495e',
    paddingBottom: '10px'
  },
  navList: {
    listStyle: 'none',
    padding: 0
  },
  navLink: {
    color: '#bdc3c7',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 0',
    fontSize: '1.1rem',
    transition: 'color 0.3s'
  },
  content: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto'
  }
};

export default App;