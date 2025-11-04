import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';

const RewardHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching transaction history
    const fetchHistory = () => {
      setTimeout(() => {
        const mockTransactions = [
          {
            id: 1,
            date: '2024-01-15',
            binId: 'BIN001',
            pointsEarned: 25,
            location: 'Main Street Mall'
          },
          {
            id: 2,
            date: '2024-01-14',
            binId: 'BIN003',
            pointsEarned: 15,
            location: 'Central Park'
          },
          {
            id: 3,
            date: '2024-01-12',
            binId: 'BIN002',
            pointsEarned: 30,
            location: 'University Campus'
          },
          {
            id: 4,
            date: '2024-01-10',
            binId: 'BIN001',
            pointsEarned: 20,
            location: 'Main Street Mall'
          },
          {
            id: 5,
            date: '2024-01-08',
            binId: 'BIN004',
            pointsEarned: 35,
            location: 'Shopping Center'
          }
        ];
        setTransactions(mockTransactions);
        setLoading(false);
      }, 1500);
    };

    fetchHistory();
  }, []);

  const goBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading transaction history...</div>
      </div>
    );
  }

  const totalPoints = transactions.reduce((sum, transaction) => sum + transaction.pointsEarned, 0);

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Reward History</h2>
          <button 
            className="btn btn-secondary"
            onClick={goBack}
            style={{ width: 'auto', padding: '8px 16px' }}
          >
            <FaArrowLeft /> Back
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaTrophy /> Total Points Earned:
          </p>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#008080' }}>
            {totalPoints} Points
          </div>
        </div>

        {transactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d' }}>
            No transactions found. Start scanning QR codes to earn points!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bin ID</th>
                  <th>Location</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.binId}</td>
                    <td>{transaction.location}</td>
                    <td style={{ color: '#28a745', fontWeight: 'bold' }}>
                      +{transaction.pointsEarned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Tips to earn more points:</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Return bottles regularly to maximize your rewards</li>
          <li>Look for bonus point events at participating locations</li>
          <li>Refer friends to earn additional bonus points</li>
          <li>Check for special promotions in the app</li>
        </ul>
      </div>
    </div>
  );
};

export default RewardHistoryPage;