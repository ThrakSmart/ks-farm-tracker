import { useState } from 'react';
import dynamic from 'next/dynamic';

const QrReader = dynamic(() => import('react-qr-reader-es6'), { ssr: false });

export default function Worker() {
  const [scanResult, setScanResult] = useState('');
  const [job, setJob] = useState('');
  const [greenhouse, setGreenhouse] = useState('');
  const [cartons, setCartons] = useState('');
  const [timeSpent, setTimeSpent] = useState('');

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      // Example: QR code might contain "GH-03"
      setGreenhouse(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleSubmit = () => {
    if (!job || !greenhouse) {
      alert('Please scan a greenhouse and select a job first.');
      return;
    }

    // For harvesting, we track cartons + time
    if (job === 'Harvesting' && (!cartons || !timeSpent)) {
      alert('Please enter cartons harvested and time spent.');
      return;
    }

    // For other jobs, we only track time
    if (job !== 'Harvesting' && !timeSpent) {
      alert('Please enter time spent.');
      return;
    }

    console.log({
      worker: 'Example Worker',
      job,
      greenhouse,
      cartons,
      timeSpent,
    });

    alert('Data submitted!');
    setCartons('');
    setTimeSpent('');
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#ff0000' }}>Worker Dashboard</h1>

      <h2>Scan Greenhouse QR</h2>
      <div style={styles.qrContainer}>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </div>

      {scanResult && <p>Scanned: {scanResult}</p>}

      <h2>Select Job</h2>
      <select
        value={job}
        onChange={(e) => setJob(e.target.value)}
        style={styles.input}
      >
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

      {job !== 'Harvesting' && job && (
        <input
          type="number"
          placeholder="Time spent (mins)"
          value={timeSpent}
          onChange={(e) => setTimeSpent(e.target.value)}
          style={styles.input}
        />
      )}

      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
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
    margin: '0 auto 20px auto'
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
