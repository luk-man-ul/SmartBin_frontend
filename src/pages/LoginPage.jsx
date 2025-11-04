import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#008080' }}>
          Welcome Back
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: '#6c757d', fontSize: '14px' }}>
          Sign in to your account
        </p>
        
        <div className="demo-notice">
          <strong>Demo Mode:</strong> working on connection.
        </div>
     
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="off"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="demo-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="off"
              placeholder="Enter any password"
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

         <p style={{ textAlign: 'right', marginTop: '6px', fontSize: '14px' }}>
          {' '}
          <Link to="">
            Forgot Password ?
          </Link>
        </p>
         
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '16px' }}>
          Don't have an account?{' '}
          <Link to="/register">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;