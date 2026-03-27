import React, { useState } from 'react';
import axios from 'axios';

const BackendControl = () => {
  const [logs, setLogs] = useState(["Server started...", "Database connected..."]);

  const runCommand = async (cmd) => {
    setLogs([...logs, `Running: ${cmd}...`]);
    try {
      // Replace with your actual Python endpoint
      await axios.post('http://localhost:8000/admin/command', { command: cmd });
      setLogs(prev => [...prev, `Success: ${cmd} completed.`]);
    } catch (err) {
      setLogs(prev => [...prev, `Error: Failed to execute ${cmd}.`]);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
        <h2>Backend Actions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => runCommand('clear_cache')} style={styles.btn}>Clear Server Cache</button>
          <button onClick={() => runCommand('restart_service')} style={styles.btn}>Restart Background Workers</button>
          <button onClick={() => runCommand('sync_db')} style={{ ...styles.btn, background: '#e67e22' }}>Sync Database</button>
        </div>
      </div>

      <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '20px', borderRadius: '10px', fontFamily: 'monospace' }}>
        <h3>Live Logs</h3>
        <div style={{ height: '200px', overflowY: 'auto' }}>
          {logs.map((log, i) => <div key={i}>{`> ${log}`}</div>)}
        </div>
      </div>
    </div>
  );
};

const styles = {
  btn: { padding: '10px', background: '#34495e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default BackendControl;