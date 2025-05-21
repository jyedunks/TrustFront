import { useState } from 'react';

function AuctionRegister(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // 경매시작가
  const [sPrice, setSPrice] = useState('');
  // 입찰단위
  const [priceUnit, setPriceUnit] = useState('');
  // 마감시간
  const [endTime, setEndTime] = useState([]);
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
  };

  // 적정가격 추천받기  *일단 랜덤으로 넣었고 추후 백엔드 연결예정
  const handleRecommendPrice = () => {
    const recommended = Math.floor(Math.random() * 20000 + 10000) // 1~3만원 랜덤
    setSPrice(recommended);
    alert(`추천 시작가는 ${recommended.toLocaleString()}원입니다.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fromData = {
      title,
      description,
      sPrice,
      priceUnit,
      category,
      endTime,
      images,
    };
    console.log('경매 등록 데이터:', fromData);
    alert('경매 물품이 등록되었습니다.')
  };



  return (
    <form 
      onSubmit = {handleSubmit}
      style = {{maxWidth: '393px', margin: '0 auto', padding: '20px'}}
    >

      <h2 style={{textAlign: 'center'}}>경매 물품 등록</h2>

      {/* 이미지 업로드 */}
      <div>
        <label>이미지 업로드 (최대 5장):</label><br/>
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
        <label>제목</label><br/>
        <input
          type = 'text'
          value = {title}
          onChange = {(e) => setTitle(e.target.value)}
          placeholder='판매할 물품 제목'
          required
        />
      </div>

      {/* 시작가 */}
      <div>
        <label>시작가</label><br/>
        <input
          text = 'number'
          value = {sPrice}
          onChange = {(e) => setSPrice(e.target.value)}
          placeholder = '시작가를 입력해주세요'
          required
        />
        <button type="button" onClick={handleRecommendPrice} style={{marginTop: '5px', marginLeft: '5px', backgroundColor:'lemonchiffon', border:'1px solid #000', borderRadius:'6px'}}>적정가격 추천받기</button>
      </div>

      {/* 입찰 단위 */}
      <div>
        <label>입찰 단위</label><br/>
        <select
          value = {priceUnit}
          onChange = {(e) => setPriceUnit(e.target.value)}
          requried
        >
          <option value={""}>단위를 선택해주세요</option>
          <option value={"500"}>500</option>
          <option value={"1000"}>1,000</option>
          <option value={"5000"}>5,000</option>
          <option value={"10000"}>10,000</option>
          <option value={"50000"}>50,000</option>
        </select>
      </div>

      {/* 마감 시간 */}
      <div>
        <label>마감 시간</label><br/>
        <input
          type = 'datetime-local'
          value = {endTime}
          onChange = {(e) => setEndTime(e.target.value)}
        />
      </div>

      {/* 내용 */}
      <div>
        <label>내용</label><br/>
        <textarea
          value = {description}
          onChange = {(e) => setDescription(e.target.value)}
          placeholder = '내용을 작성해주세요'
          required
          style ={{
            fontFamily: 'inherit',
            fontSize: '14px',
            padding: '8px',
            lineHeight: '1.5',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
      </div>

      <br/>
      <button type="button" style={{width:'100%', padding:'10px', backgroundColor:'#339ff', border:'none', borderRadius:'6px'}}>
        작성완료
      </button>
    </form>
  )
}

export default AuctionRegister;