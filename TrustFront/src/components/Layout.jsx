// src/components/Layout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 메인 콘텐츠 영역 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>

      {/* 하단 탭바 */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        borderTop: '1px solid #ccc',
        backgroundColor: '#f9f9f9'
      }}>
        <Link to="/">홈</Link>
        <Link to="/items">일반물품</Link>
        <Link to="/chat">채팅</Link>
        <Link to="/my">My</Link>
      </nav>
    </div>
  );
}

export default Layout;
