import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { businessService } from '../api/BusinessService';
import { categoryService } from '../api/CategoryService';
import axios from 'axios';
import Notifications from './Notifications';
import { auctionService } from '../api/AuctionService';
// 디자인 시스템 컬러
const colors = {
  primary: '#FF7F50',      // 메인 오렌지
  secondary: '#4A90E2',    // 블루
  accent: '#34C759',       // 그린
  background: '#F8F9FA',   // 배경
  text: '#2C3E50',         // 텍스트
  textLight: '#6C757D',    // 연한 텍스트
  border: '#E9ECEF',       // 경계선
  white: '#FFFFFF',        // 화이트
  shadow: 'rgba(0,0,0,0.1)', // 그림자
  danger: '#FF4757'
};

// 벨 아이콘 (알림)
function BellIcon({ size = 24, color = colors.text, hasNotification = false }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        width={size} height={size} viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      >
        <path
          d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z"
          fill={color}
        />
        <path
          d="M19 17H5c-.8 0-1.3-.8-.9-1.5l1.1-2V9a6.8 6.8 0 0 1 5-6.6V2a1 1 0 1 1 2 0v.4A6.8 6.8 0 0 1 18.8 9v4.5l1.1 2c.4.7-.1 1.5-.9 1.5Z"
          fill={color}
        />
      </svg>
      {hasNotification && (
        <div
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: colors.danger,
            border: `2px solid ${colors.white}`,
            boxShadow: `0 1px 3px rgba(0,0,0,0.2)`
          }}
        />
      )}
    </div>
  );
}

// 검색 아이콘
function SearchIcon({ size = 20, color = colors.textLight }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function Home() {
  // 지도 API - DOM 연결
  const mapRef = useRef(null);
  // 지도 객체 저장
  const mapInstance = useRef(null);
  // 플로팅 버튼 토글
  const [showOptions, setShowOptions] = useState(false);
  // 알림 상태
  const [hasNotification] = useState(true);
  
  // 위치 정보
  const [currentAddress, setCurrentAddress] = useState('서울특별시 강남구 강남대로');
  const [userLocation, setUserLocation] = useState(null);
  
  // 카테고리 관련 상태
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  // 상품 리스트 관련 상태
  const [allProducts, setAllProducts] = useState([]); // 전체 상품 (5km 이내)
  const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품
  const [showProductList, setShowProductList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const HEADER_HEIGHT = 56;
  const CATEGORY_BAR_HEIGHT = 60;


  // 위치 기반 상품 불러오기 (5km 이내)
  useEffect(() => {
    const fetchNearbyItems = async () => {
      try {
        console.log('📍 현재 주소:', currentAddress);

        const [products = [], auctions = []] = await Promise.all([
          categoryService.getProductsByLocation(currentAddress),
          auctionService.getAuctionsByLocation(currentAddress),
        ]);

        const combined = [
          ...products.map((p) => ({ ...p, type: 'product' })),
          ...auctions.map((a) => ({ ...a, type: 'auction' })),
        ];

        setAllProducts(combined);
        console.log('📦 불러온 데이터:', combined);

        // ✅ 지도 객체 준비 안 됐으면 잠시 대기 후 재시도
        if (!mapInstance.current) {
          console.warn('⏳ 지도 객체가 아직 생성되지 않음. 500ms 후 재시도');
          setTimeout(fetchNearbyItems, 500);
          return;
        }

        // ✅ 기존 마커 초기화 (겹침 방지)
        if (window.currentMarkers) {
          window.currentMarkers.forEach((m) => m.setMap(null));
        }
        window.currentMarkers = [];

        // ✅ 마커 생성
        combined.forEach((item) => {
          const lat = Number(item.latitude || item.lat);
          const lng = Number(item.longitude || item.lng);

          if (!lat || !lng) {
            console.warn('⚠️ 좌표 없음, 표시 불가:', item);
            return;
          }

          const markerImage = new window.kakao.maps.MarkerImage(
            item.type === 'auction'
              ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
              : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
            new window.kakao.maps.Size(32, 32)
          );

          const marker = new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: new window.kakao.maps.LatLng(lat, lng),
            image: markerImage,
          });

          window.currentMarkers.push(marker);

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="padding:8px; font-size:12px; white-space:nowrap;">
                <strong>${item.title || item.name}</strong><br/>
                ${
                  item.type === 'auction'
                    ? `경매 시작가: ${item.startPrice?.toLocaleString()}원`
                    : `${item.price?.toLocaleString()}원`
                }
              </div>
            `,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(mapInstance.current, marker);
          });
        });

        console.log('✅ 마커 표시 완료');
      } catch (error) {
        console.error('상품/경매 목록 불러오기 실패:', error);
        setAllProducts([]);
      }
    };

    if (currentAddress) fetchNearbyItems();
  }, [currentAddress]);




  // 카테고리 + 검색어로 상품 필터링
  useEffect(() => {
    let filtered = allProducts;

    // 카테고리 필터링
    if (selectedCategory && selectedCategory.id !== 'all') {
      filtered = filtered.filter(product => 
        product.categoryId === selectedCategory.id
      );
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sellerAccount?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setShowProductList(filtered.length > 0);
  }, [allProducts, selectedCategory, searchQuery]);

  // 카테고리 선택
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
    setSearchQuery(''); // 검색어 초기화
  };

  // 사업자 인증 상태 확인 함수
  const checkBusinessVerification = async () => {
    return true;
  };
  
  // 판매 클릭
  const handleSellClick = async () => {
    setShowOptions(false);

    try {
      const isVerified = await checkBusinessVerification();
      
      if (!isVerified) {
        alert('상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!');
        navigate('/my/verify');
        return;
      }

      navigate('/sellform');
      
    } catch (error) {
      alert('인증 상태를 확인할 수 없습니다. 다시 시도해주세요.');
      console.error(error);
    }
  };

  // 경매 클릭
  const handleAuctionClick = async () => {
    setShowOptions(false);

    try {
      const isVerified = await checkBusinessVerification();
      
      if (!isVerified) {
        alert('상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!');
        navigate('/my/verify');
        return;
      }

      navigate('/auctionregister');
      
    } catch (error) {
      alert('인증 상태를 확인할 수 없습니다. 다시 시도해주세요.');
      console.error(error);
    }
  };

  // 오버레이 클릭 시 드롭다운/옵션 닫기
  const closeOverlays = () => {
    setShowOptions(false);
    setIsCategoryDropdownOpen(false);
  };

  // 지도 초기화 로직
  useEffect(() => {
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps && mapRef.current) {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(37.497, 127.027), // 강남 기본 좌표
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        // 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const loc = new window.kakao.maps.LatLng(lat, lng);
            
            setUserLocation({ lat, lng });
            
            if (mapInstance.current) {
              mapInstance.current.setCenter(loc);
            }

            // 좌표를 주소로 변환 (카카오 Geocoder 사용)
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(lng, lat, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK && result[0]) {
                const address = result[0].address.address_name;
                setCurrentAddress(address);
              }
            });
          },
          (error) => {
            console.warn('위치 접근에 실패했습니다. 기본 위치(강남)로 설정됩니다.', error);
          }
        );
      } else {
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '393px',
        height: '100vh',
        margin: '0 auto',
        backgroundColor: colors.background,
        position: 'relative',
        overflow: 'hidden',
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
          boxShadow: `0 4px 16px ${colors.shadow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 999,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: colors.primary,
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: 0.2,
            }}
          >
            사당해요
          </div>
        </Link>

        {/* 알림 아이콘 */}
        <button
          onClick={() => navigate('/notifications')}
          aria-label="알림"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: 'none',
            background: colors.background,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
          <BellIcon size={20} color={colors.text} hasNotification={hasNotification} />
        </button>
      </header>

      {/* 카테고리 바 */}
      <div
        style={{
          position: 'fixed',
          top: HEADER_HEIGHT,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '393px',
          height: `${CATEGORY_BAR_HEIGHT}px`,
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          zIndex: 998,
        }}
      >
        {/* 카테고리 드롭다운 */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsCategoryDropdownOpen((v) => !v)}
            style={{
              padding: '8px 16px',
              backgroundColor: colors.background,
              border: 'none',
              outline: 'none',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: `0 2px 8px ${colors.shadow}`,
            }}
          >
            <span>{selectedCategory?.name || '카테고리'}</span>
            <span
              style={{
                transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease',
                fontSize: 10,
                color: colors.textLight,
              }}
            >
              ▼
            </span>
          </button>

          {/* 카테고리 드롭다운 메뉴 */}
          {isCategoryDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                minWidth: 160,
                backgroundColor: colors.white,
                borderRadius: 12,
                boxShadow: `0 8px 20px ${colors.shadow}`,
                overflow: 'hidden',
                zIndex: 1200,
              }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor:
                      selectedCategory?.id === category.id ? colors.background : colors.white,
                    color: colors.text,
                    fontSize: 14,
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: selectedCategory?.id === category.id ? 600 : 400,
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 검색 바 */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SearchIcon size={18} color={colors.textLight} />
          <input
            type="text"
            placeholder="상품 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              marginLeft: 8,
              padding: '8px 12px',
              border: 'none',
              outline: 'none',
              backgroundColor: colors.background,
              borderRadius: 20,
              fontSize: 14,
              color: colors.text,
            }}
          />
        </div>
      </div>

      {/* 헤더 + 카테고리바 높이만큼 여백 */}
      <div style={{ height: HEADER_HEIGHT + CATEGORY_BAR_HEIGHT }} />

      {/* 지도 영역 (플로팅 버튼과 겹치도록 확장) */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 116px)', // 헤더+카테고리바 높이 제외
          position: 'relative',
        }}
      />

      {/* 상품 리스트 오버레이 */}
      {showProductList && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '393px',
            maxHeight: '50vh',
            backgroundColor: colors.white,
            borderRadius: '20px 20px 0 0',
            boxShadow: `0 -4px 20px ${colors.shadow}`,
            overflowY: 'auto',
            zIndex: 997,
            padding: '20px 16px',
          }}
        >
          {/* 리스트 헤더 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {selectedCategory?.name} ({filteredProducts.length})
            </h3>
            <button
              onClick={() => setShowProductList(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 20,
                color: colors.textLight,
                cursor: 'pointer',
                padding: 4,
              }}
            >
              ×
            </button>
          </div>

          {/* 상품 목록 */}
          {filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: colors.textLight,
              }}
            >
              {searchQuery ? '검색 결과가 없습니다.' : '5km 이내에 등록된 상품이 없습니다.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: 12,
                    backgroundColor: colors.background,
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background;
                  }}
                >
                  {/* 상품 이미지 */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      backgroundColor: colors.border,
                      backgroundImage: product.imageUrl
                        ? `url(${product.imageUrl})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                    }}
                  />
                  
                  {/* 상품 정보 */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      {product.title}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: colors.textLight,
                      }}
                    >
                      {product.sellerAccount}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: colors.primary,
                      }}
                    >
                      {product.price?.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 플로팅 + 버튼 */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          backgroundColor: colors.primary,
          border: 'none',
          fontSize: '24px',
          color: colors.white,
          cursor: 'pointer',
          boxShadow: `0 4px 16px rgba(255, 127, 80, 0.3)`,
          transition: 'all 0.3s ease',
          transform: showOptions ? 'rotate(45deg)' : 'rotate(0deg)',
          zIndex: 1000,
        }}
        aria-label="작업 추가"
      >
        +
      </button>

      {/* 플로팅 옵션 */}
      {showOptions && (
        <div
          style={{
            position: 'fixed',
            bottom: '170px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleSellClick}
            style={{
              padding: '12px 20px',
              backgroundColor: colors.white,
              border: `2px solid ${colors.primary}`,
              borderRadius: '25px',
              cursor: 'pointer',
              color: colors.primary,
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: `0 4px 12px ${colors.shadow}`,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            물품 판매하기
          </button>
          <button
            onClick={handleAuctionClick}
            style={{
              padding: '12px 20px',
              backgroundColor: colors.secondary,
              border: `2px solid gray`,
              borderRadius: '25px',
              cursor: 'pointer',
              color: colors.white,
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: `0 4px 12px ${colors.shadow}`,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            물품 경매하기
          </button>
        </div>
      )}

      {/* 배경 오버레이 */}
      {(showOptions || isCategoryDropdownOpen) && (
        <div
          onClick={closeOverlays}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 996,
          }}
        />
      )}
    </div>
  );
}

export default Home;