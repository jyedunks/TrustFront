import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 홈과 동일한 디자인 컬러
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

// X 아이콘 (이미지 삭제용)
function XIcon({ size = 16, color = colors.white }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SellForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('전자제품');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // 최대 5장 제한
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      price,
      category,
      images,
    };
    console.log('판매 등록 데이터:', formData);
    alert('물품이 등록되었습니다!');
    navigate('/');
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
          물품 판매 등록
        </h1>
        <div style={{ width: 24 }} /> {/* 균형을 위한 공간 */}
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: HEADER_HEIGHT }} />

      {/* 폼 컨텐츠 */}
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
            {/* 이미지 업로드 버튼 */}
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
                  cursor: 'pointer',
                  backgroundColor: colors.white,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.backgroundColor = `${colors.primary}08`;
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
                />
                <CameraIcon size={32} />
                <span style={{ fontSize: 11, color: colors.textLight, marginTop: 4 }}>
                  추가
                </span>
              </label>
            )}

            {/* 이미지 미리보기 */}
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
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
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
            placeholder="판매 물품 제목을 입력해주세요"
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
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* 카테고리 */}
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
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              outline: 'none',
              backgroundColor: colors.white,
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <option>전자제품</option>
            <option>가구</option>
            <option>의류</option>
            <option>도서</option>
            <option>기타</option>
          </select>
        </div>

        {/* 가격 */}
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
            가격
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="45000"
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
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
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

        {/* 설명 */}
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
            placeholder="제품 상태, 사용 기간, 구매 시기 등을 자세히 입력해주세요"
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
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
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
          style={{
            width: '100%',
            padding: '16px',
            marginBottom: '30px',
            backgroundColor: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
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
          등록하기
        </button>
      </form>
    </div>
  );
}

export default SellForm;