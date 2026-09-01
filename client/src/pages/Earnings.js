import React, { useEffect, useState } from 'react';
import * as earningsService from '../services/earningsService';
import '../styles/earnings.css';

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const data = await earningsService.getPlatformEarnings();
      setEarnings(data);
    } catch (err) {
      setError('Error fetching earnings');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async (e) => {
    e.preventDefault();
    setPayoutLoading(true);
    try {
      const result = await earningsService.requestPayout(parseFloat(payoutAmount));
      alert(`Payout request successful! Amount: $${result.amount}`);
      setPayoutAmount('');
      setShowPayoutForm(false);
      fetchEarnings();
    } catch (err) {
      setError(err.response?.data?.error || 'Error requesting payout');
    } finally {
      setPayoutLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const summary = earnings?.summary || {};
  const transactions = earnings?.recentTransactions || [];

  return (
    <div className="earnings-page">
      <h1>💰 Platform Earnings Dashboard</h1>
      
      <div className="earnings-summary">
        <div className="earning-card">
          <h3>Total Earnings</h3>
          <p className="amount">${(summary.total_earnings || 0).toFixed(2)}</p>
          <small>All time</small>
        </div>

        <div className="earning-card success">
          <h3>Completed</h3>
          <p className="amount">${(summary.completed_earnings || 0).toFixed(2)}</p>
          <small>Ready to withdraw</small>
        </div>

        <div className="earning-card pending">
          <h3>Pending</h3>
          <p className="amount">${(summary.pending_earnings || 0).toFixed(2)}</p>
          <small>From jobs completed</small>
        </div>

        <div className="earning-card">
          <h3>Total Transactions</h3>
          <p className="amount">{summary.total_transactions || 0}</p>
          <small>Jobs processed</small>
        </div>
      </div>

      <div className="payout-section">
        {!showPayoutForm ? (
          <button 
            className="payout-btn" 
            onClick={() => setShowPayoutForm(true)}
            disabled={!summary.completed_earnings || summary.completed_earnings < 10}
          >
            💸 Request Payout
          </button>
        ) : (
          <form className="payout-form" onSubmit={handlePayout}>
            <h3>Request Payout</h3>
            <p>Available: <strong>${(summary.completed_earnings || 0).toFixed(2)}</strong></p>
            <input
              type="number"
              step="0.01"
              min="10"
              max={summary.completed_earnings}
              placeholder="Amount (min $10)"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              required
            />
            <div className="form-buttons">
              <button type="submit" disabled={payoutLoading}>
                {payoutLoading ? 'Processing...' : 'Request Payout'}
              </button>
              <button type="button" onClick={() => setShowPayoutForm(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="transactions-section">
        <h2>Recent Transactions (15% platform fee per job)</h2>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Customer</th>
                <th>Your Earnings (15%)</th>
                <th>Handyperson Pay (85%)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.job_title}</td>
                    <td>{tx.first_name} {tx.last_name}</td>
                    <td className="amount">${tx.platform_fee.toFixed(2)}</td>
                    <td className="amount">${tx.handyperson_payout.toFixed(2)}</td>
                    <td>
                      <span className={`status ${tx.status}`}>
                        {tx.status === 'succeeded' ? '✓ Completed' : tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty">No transactions yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="info-section">
        <h3>📊 How It Works</h3>
        <ul>
          <li><strong>15% Platform Fee:</strong> You earn 15% from every job completed on your platform</li>
          <li><strong>85% to Handypeople:</strong> Handypeople receive 85% of the payment</li>
          <li><strong>Automatic Tracking:</strong> All earnings are tracked automatically</li>
          <li><strong>Easy Withdrawals:</strong> Request payouts anytime (minimum $10)</li>
          <li><strong>Direct to Bank:</strong> Funds transfer directly to your bank account via Stripe</li>
        </ul>
      </div>
    </div>
  );
};

export default Earnings;