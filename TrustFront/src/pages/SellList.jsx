import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyItems } from '../api/item'; 

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

// 빈 상자 아이콘
function EmptyBoxIcon({ size = 80, color = colors.textLight }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 상품 카드 컴포넌트
function ItemCard({ item, onClick }) {
  const statusConfig = {
    '판매중': { color: colors.accent, bg: `${colors.accent}15`, text: '판매중' },
    '예약중': { color: colors.secondary, bg: `${colors.secondary}15`, text: '예약중' },
    '판매완료': { color: colors.textLight, bg: colors.background, text: '판매완료' },
  };

  const status = statusConfig[item.status] || statusConfig['판매중'];

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: 12,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 16px ${colors.shadow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`;
      }}
    >
      <div style={{ display: 'flex', padding: 16, gap: 16 }}>
        {/* 상품 이미지 */}
        <div
          style={{
            width: 80,
            height: 80,
            marginTop: 3,
            borderRadius: 12,
            backgroundColor: colors.background,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textLight,
                fontSize: 12,
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 6,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              {item.price?.toLocaleString()}원
            </p>
          </div>

          {/* 상태 배지 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                color: status.color,
                backgroundColor: status.bg,
              }}
            >
              {status.text}
            </span>
            {item.createdAt && (
              <span style={{ fontSize: 12, color: colors.textLight }}>
                {item.createdAt}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SellList() {
  const navigate = useNavigate();
  //더미 판매물품
  const [items, setItems] = useState([
  {
    id: 1,
    name: '아이폰 14 Pro',
    price: 950000,
    status: '판매중',
    image: 'https://picsum.photos/200/200?random=1',
    createdAt: '2025-10-08'
  },
  {
    id: 2,
    name: '맥북 프로 M2',
    price: 2500000,
    status: '예약중',
    image: 'https://picsum.photos/200/200?random=2',
    createdAt: '2025-10-07'
  },
  {
    id: 3,
    name: '에어팟 프로 2세대',
    price: 180000,
    status: '판매중',
    image: 'https://picsum.photos/200/200?random=3',
    createdAt: '2025-10-06'
  },
  {
    id: 4,
    name: '아이패드 Air',
    price: 750000,
    status: '판매완료',
    image: 'https://picsum.photos/200/200?random=4',
    createdAt: '2025-10-05'
  }
]);


  const [loading, setLoading] = useState(true);


  

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await fetchMyItems();
        console.log(res.data);
        setItems(res.data);
      } catch (err) {
        console.error('상품 목록을 불러오지 못했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, []);

  const handleItemClick = (itemId) => {
    // 상품 상세 페이지로 이동
    console.log('상품 클릭:', itemId);
    // navigate(`/item/${itemId}`);
  };

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
          내 판매 목록
        </h1>
        <div style={{ width: 24 }} />
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: HEADER_HEIGHT }} />

      {/* 컨텐츠 영역 */}
      <div style={{ padding: '20px' }}>
        {loading ? (
          // 로딩 상태
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: `4px solid ${colors.border}`,
                borderTop: `4px solid ${colors.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        ) : items.length === 0 ? (
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
            <EmptyBoxIcon size={80} />
            <p
              style={{
                marginTop: 20,
                fontSize: 16,
                color: colors.textLight,
                marginBottom: 24,
              }}
            >
              아직 판매 중인 상품이 없어요
            </p>
            <button
              onClick={() => navigate('/sell')}
              style={{
                padding: '12px 24px',
                backgroundColor: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${colors.primary}40`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 6px 16px ${colors.primary}50`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 12px ${colors.primary}40`;
              }}
            >
              상품 등록하기
            </button>
          </div>
        ) : (
          // 상품 목록
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: colors.textLight,
                }}
              >
                총 {items.length}개의 상품
              </p>
            </div>

            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 로딩 애니메이션 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SellList;