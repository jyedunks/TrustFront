// API 기본 URL 설정 
const API_BASE_URL = '/api'; 

/**
 * 경매 생성 API
 * @param {Object} auctionData - 경매 생성 데이터
 * @returns {Promise} API 응답
 */
export const createAuction = async (auctionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auctions/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auctionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`경매 생성 실패: ${response.status} - ${errorText}`);
    }

    try {
          return await response.json();
    }catch {
      return await response.text();
    }

  } catch (error) {
    console.error('경매 생성 에러:', error);
    throw error;
  }
};

/**
 * Top 5 입찰 내역 조회 API
 * @param {number} auctionId - 경매 ID
 * @returns {Promise<Array>} Top 5 입찰 내역
 */
export const getTop5Bids = async (auctionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids/top5/${auctionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`입찰 내역 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('입찰 내역 조회 에러:', error);
    throw error;
  }
};

/**
 * 입찰하기 API 
 * @param {number} auctionId - 경매 ID
 * @param {Object} bidData - 입찰 데이터
 * @returns {Promise} API 응답
 */
export const submitBid = async (auctionId, bidData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auctionId,
        ...bidData,
      }),
    });

    if (!response.ok) {
      throw new Error(`입찰 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('입찰 에러:', error);
    throw error;
  }
};

/**
 * 경매 상세 정보 조회 API (필요시 추가)
 * @param {number} auctionId - 경매 ID
 * @returns {Promise} 경매 상세 정보
 */
export const getAuctionDetail = async (auctionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction/${auctionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`경매 조회 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('경매 조회 에러:', error);
    throw error;
  }
};

/**
 * 낙찰 확정 api
 * @param {number} auctionId - 경매 ID
 * @param {number} bidderId - 낙찰자(최고 입찰자) id
 * @returns {Promise} 낙찰 확정 결과
 */
export const confirmWinner = async (auctionId, bidderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction/${auctionId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bidderId: bidderId,
        confirmedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`낙찰 확정 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('낙찰 확정 에러:', error);
    throw error;
  }
};


// auctions.new
// 판매자가 등록한 입찰단위, 최소가격과 안맞을 경우 alert(맞는 단위로 입력 필수)
// 타이머에는 판매자가 입력했던 경매 마감 시간 endtime 적용될 수 있게
// api에는 5등까지 반영되어 있지만 화면에는 3등까지만 띄워질 수 있도록


// AuctionRegister.js 와 연동되는건지 물어보기