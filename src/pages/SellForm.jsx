// SellForm.jsx
import { useState } from 'react';

function SellForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('전자제품');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // 새 파일 -> 기존 파일 병합
    // 기존 파일이 새 파일로 대체되는 문제 해결결
    const newImages = [...images, ...files];

    //미리보기 url(BLob)
    const newPreviews = [
      ...previews,
      ...files.map(file => URL.createObjectURL(file)),
    ]

    setImages(newImages); //원본
    setPreviews(newPreviews);
  };

  // 썸네일 삭제
  const handleRemoveImage = (index) => {
    const updatePreviews = [...previews];
    const updatedImages = [...images];

    // 미리보기 URL 메모리 해제
    URL.revokeObjectURL(previews[index]);

    updatedImages.splice(index, 1);
    updatePreviews.splice(index, 1);

    setPreviews(updatedPreviews);
    setImages(updatedImages);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      price,
      category,
      images,
    };
    console.log(formData); // 서버로 전송 예정
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{ maxWidth: '393px', margin: '0 auto', padding: '20px' }}
    >
      <h2 style={{textAlign: 'center'}}>물품 판매 등록</h2>

      {/* 이미지 업로드 */}
      <div>
        <label>이미지 업로드 (최대 5장):</label><br />
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        {/* 이미지 업로드 썸네일(미리보기) */}
        <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
          {previews.map((src, index) => (
            <img
              key = {index}
              src = {src}
              alt = {`preview-${index}`}
              // 이미지 클릭시 삭제
              onClick = {() => handleRemoveImage(index)}
              style = {{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: '2px solid #ddd'}}
            />
          ))}
        </div>
      </div>

      

      {/* 제목 */}
      <div>
        <label>제목</label><br />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="판매 물품 제목"
        />
      </div>

      {/* 설명 */}
      <div>
        <label>설명</label><br />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="제품 상태, 사용 기간 등을 입력해주세요"
        style = {{
          fontFamily: 'inherit',
          fontSize: '14px',
          padding: '8px',
          lineHeight: '1.5',
          border: '1px solid #ccc',
          borderRadius: '4px',
          resize: 'vertical',
        }}  
        />
      </div>

      {/* 가격 */}
      <div>
        <label>가격(원)</label><br />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="예) 45000"/>
      </div>

      {/* 카테고리 */}
      <div>
        <label>카테고리</label><br />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>전자제품</option>
          <option>가구</option>
          <option>의류</option>
          <option>도서</option>
          <option>기타</option>
        </select>
      </div>

      <br/>
      <button type="button" style={{width:'100%', padding:'10px', backgroundColor:'#339ff', border:'none', borderRadius:'6px'}}>
        등록하기
      </button>
    </form>
  );
}

export default SellForm;
