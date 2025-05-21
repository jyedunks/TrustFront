import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>홈</Link>
      <Link to="/market/buy" className={location.pathname.includes('/market') ? 'active' : ''}>일반물품</Link>
      <Link to="/market/auction" className={location.pathname.includes('/auction') ? 'active' : ''}>경매물품</Link>
      <Link to="/chat" className={location.pathname.startsWith('/chat') ? 'active' : ''}>채팅</Link>
      <Link to="/my" className={location.pathname.startsWith('/my') ? 'active' : ''}>My</Link>
    </nav>
  );
};

export default BottomNav;