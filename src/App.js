import React, { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

// Configuration for Cloud Run services to warm up
const WARMUP_SERVICES = [
  'https://ratio.clocknumbers.com/',
  'https://ldr.clocknumbers.com/',
  'https://fantasy.clocknumbers.com/',
  'https://streamlit.clocknumbers.com/'
];

function App() {
  useEffect(() => {
    // Warm up all Cloud Run services silently
    WARMUP_SERVICES.forEach(url => {
      fetch(url, { 
        mode: 'no-cors',
        method: 'HEAD' 
      }).catch(() => {}); // Ignore errors silently
    });
  }, []);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
