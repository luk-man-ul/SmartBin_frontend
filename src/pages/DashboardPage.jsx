import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaQrcode, FaListAlt, FaSignOutAlt } from 'react-icons/fa';

const DashboardPage = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching reward points
    const fetchPoints = () => {
      setTimeout(() => {
        setPoints(Math.floor(Math.random() * 1000) + 100); // Random points between 100-1100
        setLoading(false);
      }, 1000);
    };

    fetchPoints();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToScanner = () => {
    navigate('/scan');
  };

  const navigateToHistory = () => {
    navigate('/history');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="dashboard-stats">
          <h2>Welcome, {user?.username}!</h2>
          <p style={{ color: '#6c757d', marginBottom: '16px' }}>
            Your current reward balance:
          </p>
          <div className="points-balance">{points} Points</div>
        </div>
        
        <div className="dashboard-actions">
          <button 
            className="btn btn-success"
            onClick={navigateToScanner}
          >
            <FaQrcode /> Scan QR Code
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={navigateToHistory}
          >
            <FaListAlt /> View Reward History
          </button>
          
          <button 
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ marginTop: '24px' }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>How it works:</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Scan the QR code on a smart bottle return bin</li>
          <li>Insert your bottles into the bin</li>
          <li>Earn reward points for each bottle returned</li>
          <li>Redeem points for rewards and discounts</li>
        </ol>
      </div>
    </div>
  );
};

export default DashboardPage;