import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auctionService from '../api/AuctionService';
import { categoryService } from '../api/CategoryService';


// 홈과 동일한 디자인 시스템 컬러
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

// 카메라 아이콘
function CameraIcon({ size = 48, color = colors.textLight }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// X 아이콘
function XIcon({ size = 16, color = colors.white }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 마법봉 아이콘 (AI 추천)
function MagicIcon({ size = 18, color = colors.white }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4V2m0 2v2m0-2h2m-2 0h-2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 9L3 16l5 5 7-7-5-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 10l5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 6.5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AuctionRegister() {

  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sPrice, setSPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

 // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({ ...prev, latitude, longitude }));
          console.log('📍 등록 시 실제 좌표 적용:', latitude, longitude);
        },
        (err) => console.error('위치 접근 실패:', err)
      );
    }
  }, []);


  // 카테고리 목록 불러오기
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const data = await categoryService.getCategories();

          // ✅ 중복 제거 (id 기준)
          const unique = Array.isArray(data)
            ? data.filter(
                (cat, index, self) =>
                  index === self.findIndex((c) => c.id === cat.id)
              )
            : [];

          setCategories(unique);
        } catch (error) {
          console.error('카테고리 불러오기 실패:', error);
          alert('카테고리를 불러오는데 실패했습니다.');
        }
      };

      fetchCategories();
    }, []);


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      alert('이미지는 최대 5장까지 업로드 가능합니다.');
      return;
    }
    
    const newImages = [...images, ...files];
    const newPreviews = [
      ...previews,
      ...files.map(file => URL.createObjectURL(file)),
    ];

    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previews];
    const updatedImages = [...images];

    URL.revokeObjectURL(previews[index]);

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setPreviews(updatedPreviews);
    setImages(updatedImages);
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    setSelectedCategories(selectedOptions);
  };

  const handleRecommendPrice = () => {
    const recommended = Math.floor(Math.random() * 20000 + 10000);
    setSPrice(recommended);
    alert(`추천 시작가는 ${recommended.toLocaleString()}원입니다.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (images.length === 0) {
      alert('최소 1개의 이미지를 업로드해주세요.');
      return;
    }
    
    if (selectedCategories.length === 0) {
      alert('최소 1개의 카테고리를 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const formattedEndTime = endTime ? new Date(endTime).toISOString().slice(0, 19): '';

      // API 요청 데이터 구성
      const auctionData = {
        name: title,
        description,
        startPrice: parseInt(sPrice),
        bidUnit: parseInt(priceUnit),
        categoryIds: selectedCategories.slice(0, 3),
        endTime: endTime,
        sellerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // TODO: 로그인 구현 후 실제 사용자 ID로 교체
        address: address || '서울특별시 강남구 테헤란로 123',
        latitude: userLocation?.lat || 37.501276,
        longitude: userLocation?.lng || 127.039602,

      };

      // API 호출
      const response = await auctionService.registerAuction(auctionData, images);
      
      console.log('경매 등록 성공:', response);
      
      if (typeof response === 'string') {
        alert(response); // 예: "경매 물품이 성공적으로 등록되었습니다."
      } else if (response?.message) {
        alert(response.message);
      } else {
        alert('경매 물품이 등록되었습니다!');
      }

      navigate('/');
      
    } catch (error) {
      console.error('경매 등록 실패:', error);
      
      if (error.response) {
        // 서버 응답이 있는 경우
        alert(`경매 등록 실패: ${error.response.data.message || '서버 오류가 발생했습니다.'}`);
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        alert('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        alert('경매 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
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
          경매 물품 등록
        </h1>
        <div style={{ width: 24 }} />
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: HEADER_HEIGHT }} />

      {/* 폼 컨텐츠 */}

      {address && (
        <div style={{ marginBottom: 10, fontSize: 13, color: colors.textLight }}>
          📍 현재 위치: {address}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
        
        {/* 이미지 업로드 섹션 */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 12,
            }}
          >
            상품 이미지 <span style={{ color: colors.textLight, fontWeight: 400 }}>({previews.length}/5)</span>
          </label>
          
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {previews.length < 5 && (
              <label
                style={{
                  width: 90,
                  height: 90,
                  border: `2px dashed ${colors.border}`,
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  backgroundColor: colors.white,
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.borderColor = colors.secondary;
                    e.currentTarget.style.backgroundColor = `${colors.secondary}08`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = colors.white;
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={isLoading}
                />
                <CameraIcon size={32} />
                <span style={{ fontSize: 11, color: colors.textLight, marginTop: 4 }}>
                  추가
                </span>
              </label>
            )}

            {previews.map((src, index) => (
              <div
                key={index}
                style={{
                  width: 90,
                  height: 90,
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: `0 2px 8px ${colors.shadow}`,
                }}
              >
                <img
                  src={src}
                  alt={`preview-${index}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                  disabled={isLoading}
                >
                  <XIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
            placeholder="경매 물품 제목을 입력해주세요"
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              outline: 'none',
              backgroundColor: colors.white,
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              opacity: isLoading ? 0.6 : 1,
            }}
            onFocus={(e) => {
              if (!isLoading) {
                e.target.style.borderColor = colors.secondary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* 카테고리 (다중 선택 가능) */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            카테고리 <span style={{ color: colors.textLight, fontWeight: 400, fontSize: 13 }}>(Ctrl/Cmd로 다중 선택 가능)</span>
          </label>
          <select
            multiple
            value={selectedCategories.map(String)}
            onChange={handleCategoryChange}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              outline: 'none',
              backgroundColor: colors.white,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
              minHeight: 120,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {selectedCategories.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 13, color: colors.textLight }}>
              선택된 카테고리: {selectedCategories.join(', ')}
            </div>
          )}
        </div>

        {/* 시작가 + AI 추천 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: colors.text,
                margin: 0,
              }}
            >
              시작가
            </label>
            <button
              type="button"
              onClick={handleRecommendPrice}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                backgroundColor: colors.white,
                color: colors.accent,
                border: `1px solid ${colors.accent}`,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = colors.accent;
                  e.target.style.color = colors.white;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.color = colors.accent;
              }}
            >
              <MagicIcon size={14} color="currentColor" />
              AI 추천
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={sPrice}
              onChange={(e) => setSPrice(e.target.value)}
              required
              disabled={isLoading}
              placeholder="10000"
              style={{
                width: '100%',
                padding: '14px 16px',
                paddingRight: 40,
                fontSize: 15,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                outline: 'none',
                backgroundColor: colors.white,
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = colors.secondary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 15,
                color: colors.textLight,
                pointerEvents: 'none',
              }}
            >
              원
            </span>
          </div>
        </div>

        {/* 입찰 단위 */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            입찰 단위
          </label>
          <select
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              outline: 'none',
              backgroundColor: colors.white,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <option value="">단위를 선택해주세요</option>
            <option value="500">500원</option>
            <option value="1000">1,000원</option>
            <option value="5000">5,000원</option>
            <option value="10000">10,000원</option>
            <option value="50000">50,000원</option>
          </select>
        </div>

        {/* 마감 시간 */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            경매 마감 시간
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              outline: 'none',
              backgroundColor: colors.white,
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              opacity: isLoading ? 0.6 : 1,
            }}
            onFocus={(e) => {
              if (!isLoading) {
                e.target.style.borderColor = colors.secondary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* 상품 설명 */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            상품 설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
            placeholder="제품 상태, 사용 기간, 경매 이유 등을 자세히 입력해주세요"
            rows={6}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              lineHeight: 1.6,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              outline: 'none',
              backgroundColor: colors.white,
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
              opacity: isLoading ? 0.6 : 1,
            }}
            onFocus={(e) => {
              if (!isLoading) {
                e.target.style.borderColor = colors.secondary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* 등록 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: isLoading ? colors.textLight : colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: `0 4px 12px ${colors.primary}40`,
            transition: 'all 0.2s ease',
            marginBottom: 30,
            opacity: isLoading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 6px 16px ${colors.primary}50`;
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `0 4px 12px ${colors.primary}40`;
          }}
        >
          {isLoading ? '등록 중...' : '경매 등록하기'}
        </button>
      </form>
    </div>
  );
}

export default AuctionRegister;