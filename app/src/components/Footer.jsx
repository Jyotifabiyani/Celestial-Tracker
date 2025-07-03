import React from 'react';
import '../Footer.css'; // Optional - if you want to style your footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Celestial Tracker - Your Astronomy Companion</p>
        
      </div>
    </footer>
  );
};

export default Footer;