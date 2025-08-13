import { useState } from 'react';

export default function Supervisor() {
  const [assignments, setAssignments] = useState([]);
  const [workerName, setWorkerName] = useState('');
  const [greenhouse, setGreenhouse] = useState('');
  const [job, setJob] = useState('');

  const greenhouses = ['GH-01', 'GH-02', 'GH-03', 'GH-04', 'GH-05', 'GH-06'];
  const jobs = ['Harvesting', 'Pruning', 'Cleaning', 'Planting'];

  const handleAssign = () => {
    if (workerName && greenhouse && job) {
      setAssignments([...assignments, { workerName, greenhouse, job }]);
      setWorkerName('');
      setGreenhouse('');
      setJob('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#ff0000' }}>Supervisor Dashboard</h1>

      <h2>Assign Worker to Job</h2>
      <input
        type="text"
        value={workerName}
        onChange={(e) => setWorkerName(e.target.value)}
        placeholder="Worker Name"
        style={styles.input}
      />
      <select value={greenhouse} onChange={(e) => setGreenhouse(e.target.value)} style={styles.input}>
        <option value="">Select Greenhouse</option>
        {greenhouses.map((gh) => (
          <option key={gh} value={gh}>{gh}</option>
        ))}
      </select>
      <select value={job} onChange={(e) => setJob(e.target.value)} style={styles.input}>
        <option value="">Select Job</option>
        {jobs.map((j) => (
          <option key={j} value={j}>{j}</option>
        ))}
      </select>

      <button style={styles.button} onClick={handleAssign}>Assign</button>

      <h2>Current Assignments</h2>
      <ul>
        {assignments.map((a, index) => (
          <li key={index}>
            {a.workerName} → {a.job} @ {a.greenhouse}
          </li>
        ))}
      </ul>
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
