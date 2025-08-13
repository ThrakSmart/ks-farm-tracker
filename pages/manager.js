import { useState } from 'react';

export default function Manager() {
  const [jobs, setJobs] = useState([]);
  const [jobName, setJobName] = useState('');
  const [expectedTime, setExpectedTime] = useState('');

  const handleAddJob = () => {
    if (jobName && expectedTime) {
      setJobs([...jobs, { jobName, expectedTime }]);
      setJobName('');
      setExpectedTime('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#ff0000' }}>Manager Dashboard</h1>

      <h2>Create Daily Job</h2>
      <input
        type="text"
        value={jobName}
        onChange={(e) => setJobName(e.target.value)}
        placeholder="Job Name (e.g., Harvesting)"
        style={styles.input}
      />
      <input
        type="number"
        value={expectedTime}
        onChange={(e) => setExpectedTime(e.target.value)}
        placeholder="Expected Time (mins)"
        style={styles.input}
      />
      <button style={styles.button} onClick={handleAddJob}>Add Job</button>

      <h2>Today's Jobs</h2>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            {job.jobName} — Expected: {job.expectedTime} mins
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
