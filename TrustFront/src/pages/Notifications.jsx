import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 홈과 동일한 디자인 시스템
const colors = {
  primary: '#FF7F50',
  secondary: '#4A90E2',
  accent: '#34C759',
  background: '#F8F9FA',
  text: '#2C3E50',
  textLight: '#6C757D',
  border: '#E9ECEF',
  white: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.1)',
  danger: '#FF4757'
};

// 뒤로가기 아이콘
function BackIcon({ size = 24, color = colors.text }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 빈 알림 아이콘
function EmptyBellIcon({ size = 80, color = colors.textLight }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 알림 카드 컴포넌트
function NotificationCard({ notification, onClick }) {
  const typeConfig = {
    '입찰': { icon: '💰', color: colors.secondary, bg: `${colors.secondary}15` },
    '판매': { icon: '🛒', color: colors.primary, bg: `${colors.primary}15` },
    '경매': { icon: '⚡', color: colors.accent, bg: `${colors.accent}15` },
    '시스템': { icon: '📢', color: colors.textLight, bg: colors.background },
  };

  const config = typeConfig[notification.type] || typeConfig['시스템'];

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: notification.read ? colors.background : colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: `1px solid ${notification.read ? colors.border : 'transparent'}`,
        boxShadow: notification.read ? 'none' : `0 2px 8px ${colors.shadow}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* 아이콘 */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </div>

        {/* 알림 내용 */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: config.color,
              }}
            >
              {notification.type}
            </span>
            <span style={{ fontSize: 12, color: colors.textLight }}>
              {notification.time}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: colors.text,
              fontWeight: notification.read ? 400 : 600,
              lineHeight: 1.5,
            }}
          >
            {notification.message}
          </p>
        </div>

        {/* 읽지 않음 표시 */}
        {!notification.read && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: colors.danger,
              marginTop: 4,
            }}
          />
        )}
      </div>
    </div>
  );
}

function Notifications() {
  const navigate = useNavigate();
  
  // 더미 알림 데이터
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: '입찰',
      message: '아이폰 14 Pro 경매에 새로운 입찰이 들어왔습니다.',
      time: '5분 전',
      read: false,
    },
    {
      id: 2,
      type: '판매',
      message: '맥북 프로가 판매 완료되었습니다.',
      time: '1시간 전',
      read: false,
    },
    {
      id: 3,
      type: '경매',
      message: '에어팟 프로 경매가 마감되었습니다.',
      time: '3시간 전',
      read: true,
    },
    {
      id: 4,
      type: '시스템',
      message: '새로운 기능이 업데이트되었습니다.',
      time: '1일 전',
      read: true,
    },
  ]);

  const handleNotificationClick = (id) => {
    setNotifications(
      notifications.map((noti) =>
        noti.id === id ? { ...noti, read: true } : noti
      )
    );
    // 알림 클릭 시 관련 페이지로 이동하는 로직 추가 가능
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const HEADER_HEIGHT = 56;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '393px',
        minHeight: '100vh',
        margin: '0 auto',
        backgroundColor: colors.background,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 고정 헤더 */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '393px',
          height: `${HEADER_HEIGHT}px`,
          backgroundColor: colors.white,
          boxShadow: `0 2px 8px ${colors.shadow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 1000,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
          }}
        >
          <BackIcon />
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          알림 {unreadCount > 0 && <span style={{ color: colors.danger }}>({unreadCount})</span>}
        </h1>
        <div style={{ width: 24 }} />
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: HEADER_HEIGHT }} />

      {/* 알림 목록 */}
      <div style={{ padding: '20px' }}>
        {notifications.length === 0 ? (
          // 빈 상태
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
            }}
          >
            <EmptyBellIcon size={80} />
            <p
              style={{
                marginTop: 20,
                fontSize: 16,
                color: colors.textLight,
              }}
            >
              알림이 없습니다
            </p>
          </div>
        ) : (
          // 알림 목록
          <div>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;