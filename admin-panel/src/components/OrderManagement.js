import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    { id: 101, customer: "John Doe", product: "AI Credits", status: "Pending", total: "$50.00" },
    { id: 102, customer: "Jane Smith", product: "App Template", status: "Shipped", total: "$120.00" }
  ]);

  // Use this to fetch from your Python backend later
  // useEffect(() => { axios.get('/orders').then(res => setOrders(res.data)) }, []);

  const updateStatus = (id) => {
    alert(`Updating order #${id} status...`);
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
      <h2>Recent Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '10px' }}>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>#{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              <td><span style={{ color: order.status === 'Pending' ? 'orange' : 'green' }}>{order.status}</span></td>
              <td>
                <button onClick={() => updateStatus(order.id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;