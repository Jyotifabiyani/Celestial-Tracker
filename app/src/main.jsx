import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './spaceBackground.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="space-background">
      <div className="stars"></div>
      <App />
    </div>
  </React.StrictMode>
);