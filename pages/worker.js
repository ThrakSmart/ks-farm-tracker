import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const QrReader = dynamic(() => import('react-web-qr-reader'), { ssr: false });

export default function Worker() {
  const [scanResult, setScanResult] = useState('');
  const [job, setJob] = useState('');
  const [greenhouse, setGreenhouse] = useState('');
  const [cartons, setCartons] = useState('');
  const [timeSpent, setTimeSpent] = useState('');

  const handleScan = (result) => {
    if (result) {
      const value = result.data || result.text || result;
      setScanResult(value);
      setGreenhouse(value);
    }
  };

  const handleError = (err) => {
    console.error('QR Scan Error:', err);
  };

  const handleSubmit = () => {
    console.log({
      worker: 'Example Worker',
      job,
      greenhouse,
      cartons,
      timeSpent
    });
    alert('Data submitted!');
    setCartons('');
    setTimeSpent('');
  };

  const previewStyle = {
    height: 240,
    width: 320
  };

  return (
    <div style={styles.container}>
      <h1>Worker Dashboard</h1>

      <h2>Scan Greenhouse QR</h2>
      <div style={styles.qrContainer}>
        <QrReader
          delay={300}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
      </div>

      {scanResult && <p>Scanned: {scanResult}</p>}

      <h2>Select Job</h2>
      <select value={job} onChange={(e) => setJob(e.target.value)} style={styles.input}>
        <option value="">Select Job</option>
        <option value="Harvesting">Harvesting</option>
        <option value="Pruning">Pruning</option>
        <option value="Cleaning">Cleaning</option>
        <option value="Planting">Planting</option>
      </select>

      {job === 'Harvesting' && (
        <>
          <input
            type="number"
            placeholder="Cartons harvested"
            value={cartons}
            onChange={(e) => setCartons(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Time spent (mins)"
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
            style={styles.input}
          />
        </>
      )}

      {job && job !== 'Harvesting' && (
        <input
          type="number"
          placeholder="Time spent (mins)"
          value={timeSpent}
          onChange={(e) => setTimeSpent(e.target.value)}
          style={styles.input}
        />
      )}

      <button style={styles.button} onClick={handleSubmit}>Submit</button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center'
  },
  qrContainer: {
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '80%',
    margin: '5px auto',
    display: 'block'
  },
  button: {
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};
