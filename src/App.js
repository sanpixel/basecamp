import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ActiveTodosPage from './components/ActiveTodosPage';
import DevelopmentTodosPage from './components/DevelopmentTodosPage';
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
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/todos/active" element={<ActiveTodosPage />} />
          <Route path="/todos/development" element={<DevelopmentTodosPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
