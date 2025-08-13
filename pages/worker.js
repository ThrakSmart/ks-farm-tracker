import { useState } from 'react';

export default function Worker() {
  const [job, setJob] = useState('');
  const [greenhouse, setGreenhouse] = useState('');
  const [cartons, setCartons] = useState('');
  const [timeSpent, setTimeSpent] = useState('');

  const handleSubmit = () => {
    if (!job || !greenhouse) {
      alert('Please enter a greenhouse and select a job first.');
      return;
    }
    if (job === 'Harvesting' && (!cartons || !timeSpent)) {
      alert('Please enter cartons harvested and time spent.');
      return;
    }
    if (job !== 'Harvesting' && !timeSpent) {
      alert('Please enter time spent.');
      return;
    }
    console.log({ worker: 'Example Worker', job, greenhouse, cartons, timeSpent });
    alert('Data submitted!');
    setCartons('');
    setTimeSpent('');
    setGreenhouse('');
    setJob('');
  };

  return (
    <div style={styles.container}>
      <h1>Worker Dashboard</h1>

      <h2>Enter Greenhouse Number</h2>
      <input
        type="text"
        placeholder="Greenhouse ID"
        value={greenhouse}
        onChange={(e) => setGreenhouse(e.target.value)}
        style={styles.input}
      />

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
