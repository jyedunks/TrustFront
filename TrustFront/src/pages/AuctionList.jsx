import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import  auctionService  from '../api/AuctionService';

// 디자인 컬러 (일반물품과 동일)
const colors = {
  primary: '#FF7F50',
  background: '#F8F9FA',
  text: '#111',
  textLight: '#777',
  white: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.06)',
  border: '#E9ECEF',
};

export default function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true);
        const data = await auctionService.getAuctions();

        // 상세 호출해서 이미지 추가
        const auctionsWithThumbnails = await Promise.all(
          data.map(async (auction) => {
            try {
              const detail = await auctionService.getAuctionDetail(auction.id);
              const thumbnail =
                detail.images && detail.images.length > 0
                  ? detail.images[0].imageUrl || detail.images[0]
                  : null;

              return { ...auction, thumbnailUrl: thumbnail };
            } catch (err) {
              console.warn(`경매 ${auction.id} 상세 불러오기 실패`, err);
              return { ...auction, thumbnailUrl: null };
            }
          })
        );
        setAuctions(data);
      } catch (err) {
        console.error('경매 목록 조회 실패:', err);
        setError('경매 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: colors.textLight }}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: colors.primary }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, backgroundColor: colors.background, minHeight: '100vh' }}>
      <h2 style={{ margin: '8px 0 16px', fontSize: 20, fontWeight: 700, color: colors.text }}>
        경매 물품
      </h2>
      
      {auctions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: colors.textLight,
          fontSize: 14 
        }}>
          등록된 경매 물품이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {auctions.map((item) => (
            <Link
              key={item.id}
              to={`/market/bid/${item.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '96px 1fr',
                gap: 12,
                padding: 14,
                borderRadius: 14,
                background: colors.white,
                boxShadow: `0 2px 14px ${colors.shadow}`,
                textDecoration: 'none',
                color: colors.text,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 14px ${colors.shadow}`;
              }}
            >
              {/* 이미지 영역 - API에 이미지가 없으면 placeholder */}
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 12,
                  background: '#eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: colors.textLight,
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
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  '이미지 없음'
                )}
              </div>

              {/* 정보 영역 */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>
                  {item.name}
                </div>
                
                {/* 시작가 표시 (API에 startPrice가 있다면) */}
                {item.startPrice && (
                  <div style={{ 
                    fontWeight: 800, 
                    marginBottom: 8,
                    color: colors.primary,
                    fontSize: 16
                  }}>
                    시작가 {item.startPrice.toLocaleString()}원
                  </div>
                )}
                
                {/* 설명 또는 상태 */}
                <div style={{ 
                  fontSize: 12, 
                  color: colors.textLight,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {item.description || '경매 진행 중'}
                </div>

                {/* 경매 타입 표시 */}
                {item.itemType === 'AUCTION' && (
                  <div style={{
                    marginTop: 8,
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    🔨 경매
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 