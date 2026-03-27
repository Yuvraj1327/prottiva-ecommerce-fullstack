import React from 'react';
import { Users, DollarSign, Package, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: '$12,450', icon: <DollarSign color="green" /> },
    { label: 'Total Orders', value: '156', icon: <Package color="blue" /> },
    { label: 'New Customers', value: '42', icon: <Users color="purple" /> },
    { label: 'Pending Issues', value: '3', icon: <AlertCircle color="red" /> },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{stat.label}</span>
              {stat.icon}
            </div>
            <h2 style={{ marginTop: '10px' }}>{stat.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  }
};

export default Dashboard;