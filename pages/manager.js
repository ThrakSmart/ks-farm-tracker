import { useEffect, useMemo, useState } from 'react';
import { addJob, deleteJob, loadJobs, generateId, todayDate } from '../lib/storage';

const BRAND = {
  red: '#d90429',
  black: '#111',
  white: '#fff',
};

const DEFAULT_GREENHOUSE_HINT = 'e.g., 1,2,5-8 or GH-01,GH-02';
const PRESET_TYPES = ['Harvesting', 'Pruning', 'Cleaning', 'Planting', 'Other'];

const parseGreenhouses = (input) => {
  // Accept "1,2,5-8" or "GH-01,GH-02"
  const clean = (s) => s.trim();
  if (!input) return [];
  const parts = input.split(',').map(clean).filter(Boolean);
  const list = [];
  parts.forEach((p) => {
    // handle ranges like 5-8
    const m = p.match(/^(\D*\d+)\s*-\s*(\D*\d+)$/);
    if (m) {
      // extract trailing numbers
      const n1 = parseInt(m[1].match(/(\d+)/)?.[1] || '', 10);
      const n2 = parseInt(m[2].match(/(\d+)/)?.[1] || '', 10);
      if (!isNaN(n1) && !isNaN(n2) && n2 >= n1) {
        for (let n = n1; n <= n2; n++) list.push(formatGH(n));
      }
    } else {
      // single item; if numeric -> format GH
      const num = parseInt(p.match(/(\d+)/)?.[1] || '', 10);
      if (!isNaN(num)) list.push(formatGH(num));
      else list.push(p); // already like GH-01
    }
  });
  // de-dup & sort by number if GH-XX
  const uniq = Array.from(new Set(list));
  return uniq.sort((a, b) => ghNumber(a) - ghNumber(b));
};

const ghNumber = (gh) => {
  const m = gh.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

const formatGH = (n) => `GH-${String(n).padStart(2, '0')}`;

export default function ManagerPage() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState(PRESET_TYPES[0]);
  const [measurement, setMeasurement] = useState('RESULTS'); // RESULTS | TIME
  const [resultUnit, setResultUnit] = useState('cartons');   // visible if RESULTS
  const [ghInput, setGhInput] = useState('');
  const [ghList, setGhList] = useState([]);
  const today = useMemo(() => todayDate(), []);

  useEffect(() => {
    setJobs(loadJobs());
  }, []);

  useEffect(() => {
    // auto default unit if user picks Harvesting
    if (jobType.toLowerCase() === 'harvesting' && measurement === 'RESULTS') {
      setResultUnit('cartons');
    }
  }, [jobType, measurement]);

  const addGreenhousesFromInput = () => {
    const parsed = parseGreenhouses(ghInput);
    if (parsed.length === 0) return;
    const merged = Array.from(new Set([...ghList, ...parsed]));
    setGhList(merged);
    setGhInput('');
  };

  const removeGH = (gh) => setGhList(ghList.filter((g) => g !== gh));

  const resetForm = () => {
    setTitle('');
    setJobType(PRESET_TYPES[0]);
    setMeasurement('RESULTS');
    setResultUnit('cartons');
    setGhInput('');
    setGhList([]);
  };

  const handleCreateJob = () => {
    if (!title.trim()) {
      alert('Please enter a job title.');
      return;
    }
    if (!jobType) {
      alert('Please select a job type.');
      return;
    }
    if (ghList.length === 0) {
      alert('Please add at least one greenhouse.');
      return;
    }
    if (measurement === 'RESULTS' && !resultUnit.trim()) {
      alert('Please set the results unit (e.g., cartons).');
      return;
    }

    const job = {
      id: generateId(),
      date: today,             // job is valid only for today
      title: title.trim(),
      type: jobType,
      measurement,             // 'RESULTS' or 'TIME'
      resultUnit: measurement === 'RESULTS' ? resultUnit.trim() : null,
      greenhouses: ghList,     // e.g., ['GH-01','GH-03']
      createdAt: new Date().toISOString(),
    };

    addJob(job);
    const updated = loadJobs();
    setJobs(updated);
    resetForm();
  };

  const handleDelete = (id) => {
    const updated = deleteJob(id);
    setJobs(updated);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>KS Farm Tracker — Manager</h1>
        <div style={styles.todayBadge}>Today: {today}</div>
      </header>

      <section style={styles.card}>
        <h2 style={styles.h2}>Create today’s job</h2>

        <label style={styles.label}>Job title</label>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Morning Harvest A"
          maxLength={80}
        />

        <label style={styles.label}>Job type</label>
        <div style={styles.rowWrap}>
          {PRESET_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setJobType(t)}
              style={{
                ...styles.pill,
                ...(jobType === t ? styles.pillActive : {}),
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <label style={styles.label}>Measurement mode</label>
        <div style={styles.rowWrap}>
          <button
            onClick={() => setMeasurement('RESULTS')}
            style={{ ...styles.pill, ...(measurement === 'RESULTS' ? styles.pillActive : {}) }}
          >
            Results + Time (e.g., Harvesting)
          </button>
          <button
            onClick={() => setMeasurement('TIME')}
            style={{ ...styles.pill, ...(measurement === 'TIME' ? styles.pillActive : {}) }}
          >
            Time‑only (compare to suggested hours)
          </button>
        </div>

        {measurement === 'RESULTS' && (
          <>
            <label style={styles.label}>Result unit</label>
            <input
              style={styles.input}
              value={resultUnit}
              onChange={(e) => setResultUnit(e.target.value)}
              placeholder="e.g., cartons, trays, kg"
            />
          </>
        )}

        <label style={styles.label}>Greenhouses for this job</label>
        <div style={styles.row}>
          <input
            style={{ ...styles.input, flex: 1 }}
            value={ghInput}
            onChange={(e) => setGhInput(e.target.value)}
            placeholder={DEFAULT_GREENHOUSE_HINT}
          />
          <button onClick={addGreenhousesFromInput} style={styles.addBtn}>Add</button>
        </div>

        {ghList.length > 0 && (
          <div style={styles.ghWrap}>
            {ghList.map((g) => (
              <span key={g} style={styles.ghChip} onClick={() => removeGH(g)} title="Remove">
                {g} ✕
              </span>
            ))}
          </div>
        )}

        <button onClick={handleCreateJob} style={styles.primaryBtn}>
          Create Job for Today
        </button>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>Today’s jobs ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p style={{opacity: 0.8}}>No jobs created yet for today.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Measurement</th>
                  <th>Greenhouses</th>
                  <th>Unit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td>{j.title}</td>
                    <td>{j.type}</td>
                    <td>{j.measurement === 'RESULTS' ? 'Results + Time' : 'Time‑only'}</td>
                    <td>{j.greenhouses.join(', ')}</td>
                    <td>{j.resultUnit || '—'}</td>
                    <td>
                      <button onClick={() => handleDelete(j.id)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p style={styles.hint}>
          Note: Jobs auto‑expire after today. The Supervisor will only see this list (today’s jobs).
        </p>
      </section>
    </div>
  );
}

const styles = {
  page: { maxWidth: 960, margin: '0 auto', padding: 16 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  h1: { margin: 0, color: BRAND.black },
  todayBadge: { background: BRAND.black, color: BRAND.white, padding: '6px 10px', borderRadius: 8 },
  card: { background: '#fff', border: `1px solid #eee`, borderRadius: 14, padding: 16, margin: '12px 0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  h2: { marginTop: 0, color: BRAND.black },
  label: { display: 'block', fontWeight: 600, marginTop: 12, marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #ddd', fontSize: 16 },
  row: { display: 'flex', gap: 8, alignItems: 'center' },
  rowWrap: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  pill: { border: '1px solid #ddd', background: '#f8f8f8', padding: '8px 10px', borderRadius: 999, cursor: 'pointer' },
  pillActive: { background: BRAND.red, color: BRAND.white, borderColor: BRAND.red },
  ghWrap: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  ghChip: { background: '#f1f1f1', borderRadius: 999, padding: '6px 10px', cursor: 'pointer', border: '1px solid #e5e5e5' },
  addBtn: { background: '#eee', border: '1px solid #ddd', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' },
  primaryBtn: { background: BRAND.red, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 18px', marginTop: 14, cursor: 'pointer', fontWeight: 700 },
  deleteBtn: { background: '#fff', color: BRAND.red, border: `1px solid ${BRAND.red}`, borderRadius: 10, padding: '6px 10px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  hint: { marginTop: 8, fontSize: 13, opacity: 0.8 },
};
