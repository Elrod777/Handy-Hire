import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="dashboard-loading">Please login to access dashboard</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.email}</h1>
      <p>User Type: <strong>{user.user_type === 'customer' ? 'Customer' : 'Handyperson'}</strong></p>
      {user.user_type === 'customer' && (
        <section>
          <h2>Your Jobs</h2>
          <p>Your posted jobs will appear here</p>
        </section>
      )}
      {user.user_type === 'handyperson' && (
        <section>
          <h2>Your Bookings</h2>
          <p>Your bookings will appear here</p>
        </section>
      )}
    </div>
  );
};

export default Dashboard;