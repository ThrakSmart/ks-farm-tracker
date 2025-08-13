import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState('');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'worker') {
      router.push('/worker');
    } else if (selectedRole === 'supervisor') {
      router.push('/supervisor');
    } else if (selectedRole === 'manager') {
      router.push('/manager');
    }
  };

  return (
    <div style={styles.container}>
      <img src="/icons/icon-192.png" alt="KS Farm Tracker Logo" style={{ width: 100, marginBottom: 20 }} />
      <h1 style={{ color: '#ff0000' }}>KS Farm Tracker</h1>
      <p>Select your role to continue:</p>
      <button style={styles.button} onClick={() => handleRoleSelect('manager')}>Manager</button>
      <button style={styles.button} onClick={() => handleRoleSelect('supervisor')}>Supervisor</button>
      <button style={{ ...styles.button, backgroundColor: '#000', color: '#fff' }} onClick={() => handleRoleSelect('worker')}>Worker (QR Scan)</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px 20px'
  },
  button: {
    display: 'block',
    width: '80%',
    margin: '10px auto',
    padding: '15px',
    fontSize: '18px',
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};
