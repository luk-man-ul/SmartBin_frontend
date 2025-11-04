import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { BrowserQRCodeReader } from '@zxing/library';
import { FaArrowLeft, FaCamera, FaRedo } from 'react-icons/fa';

const ScannerPage = () => {
  const [scanning, setScanning] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const webcamRef = useRef(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const navigate = useNavigate();

  const connectToBin = async (binId) => {
    setConnecting(true);
    setError('');
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        
        if (token && binId) {
          // Simulate successful connection
          resolve({
            success: true,
            message: `Successfully connected to bin ${binId}`,
            pointsEarned: Math.floor(Math.random() * 30) + 10 // Random points 10-40
          });
        } else {
          reject(new Error('Failed to connect to bin. Please try again.'));
        }
      }, 2000);
    });
  };

  const capture = useCallback(async () => {
    if (webcamRef.current && scanning) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const result = await codeReader.current.decodeFromImage(undefined, imageSrc);
          if (result) {
            setScanning(false);
            
            try {
              // Extract bin ID from QR code data
              const qrData = result.getText();
              let binId;
              
              // Try to parse as JSON first (in case QR contains structured data)
              try {
                const parsed = JSON.parse(qrData);
                binId = parsed.binId || parsed.id || qrData;
              } catch {
                // If not JSON, use the raw data as bin ID
                binId = qrData;
              }

              setSuccess(`QR Code detected: ${binId}`);
              
              // Connect to bin
              const response = await connectToBin(binId);
              
              if (response.success) {
                alert(`Success! Connected to bin ${binId}. You earned ${response.pointsEarned} points!`);
                navigate('/dashboard');
              }
            } catch (err) {
              setError(err.message);
              setConnecting(false);
              // Allow scanning again after error
              setTimeout(() => {
                setScanning(true);
                setError('');
              }, 3000);
            }
          }
        } catch (err) {
          // No QR code found in this frame, continue scanning
        }
      }
    }
  }, [scanning, navigate]);

  // Continuously try to scan
  React.useEffect(() => {
    if (scanning) {
      const interval = setInterval(capture, 500);
      return () => clearInterval(interval);
    }
  }, [scanning, capture]);

  const goBack = () => {
    navigate('/dashboard');
  };

  const resetScanner = () => {
    setScanning(true);
    setError('');
    setSuccess('');
    setConnecting(false);
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>QR Code Scanner</h2>
          <button 
            className="btn btn-secondary"
            onClick={goBack}
            style={{ width: 'auto', padding: '8px 16px' }}
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="scanner-container">
          {scanning && !connecting && (
            <>
              <div className="scanner-instructions">
                <FaCamera style={{ marginRight: '8px' }} />
                Point your camera at the QR code on the bottle return bin
              </div>
              
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: 'environment' // Use back camera
                }}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  borderRadius: '8px'
                }}
              />
              
              <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '16px' }}>
                Make sure the QR code is clearly visible and well-lit
              </p>
            </>
          )}

          {connecting && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
              <h3>Connecting to Bin...</h3>
              <p style={{ color: '#6c757d' }}>
                Please wait while we establish connection with the bottle return bin.
              </p>
            </div>
          )}

          {success && !connecting && (
            <div className="success" style={{ textAlign: 'center', fontSize: '16px', marginBottom: '16px' }}>
              ✅ {success}
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center' }}>
              <div className="error" style={{ fontSize: '16px', marginBottom: '16px' }}>
                ❌ {error}
              </div>
              <button 
                className="btn btn-primary"
                onClick={resetScanner}
                style={{ width: 'auto', padding: '8px 16px' }}
              >
                <FaRedo /> Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Scanning Tips:</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Hold your phone steady and ensure good lighting</li>
          <li>Position the QR code within the camera frame</li>
          <li>Keep the camera about 6-12 inches from the QR code</li>
          <li>Make sure the QR code is not damaged or dirty</li>
        </ul>
      </div>
    </div>
  );
};

export default ScannerPage;