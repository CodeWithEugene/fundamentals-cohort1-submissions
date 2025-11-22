import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-left">© {new Date().getFullYear()} LegacyBridge — Connecting legacy systems</div>
        <div className="footer-right">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
