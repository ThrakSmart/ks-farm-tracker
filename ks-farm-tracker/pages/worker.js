import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import QR reader so it only loads in browser
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

export default function Worker() {
  const [scanResult, setScanResult] = useState('');
  const [manualCode, setManualCode] = useState('');

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleManualSubmit = () => {
    if (manualCode.trim() !== '') {
      setScanResult(manualCode.trim());
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#ff0000' }}>Worker Check-In</h1>

      {!scanResult ? (
        <>
          <p>Scan your greenhouse QR code:</p>
          <div style={styles.qrContainer}>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
          <p>Or enter code manually:</p>
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter greenhouse code"
            style={styles.input}
          />
          <button style={styles.button} onClick={handleManualSubmit}>Submit</button>
        </>
      ) : (
        <div>
          <h2>Assigned to: {scanResult}</h2>
          <p>✅ You are now checked in for this greenhouse.</p>
          {/* Here we could log start time, greenhouse, and job type */}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center'
  },
  qrContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '80%',
    margin: '10px auto',
    display: 'block'
  },
  button: {
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
