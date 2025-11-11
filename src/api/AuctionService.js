import apiClient from './Client';

export const auctionService = {
  // 경매 물품 등록 (판매자용)
  registerAuction: async (auctionData, images) => {
    const formData = new FormData();

  let endTimeFormatted = '';
  if (auctionData.endTime) {
    const endDate = new Date(auctionData.endTime);
    const offset = endDate.getTimezoneOffset() * 60000; // 분 → 밀리초
    const localISOTime = new Date(endDate - offset).toISOString().slice(0, 19); // 한국시간 기준 ISO 문자열

    endTimeFormatted = localISOTime; // ✅ 여기서 보정된 시간 사용

    console.log('원본 endTime:', auctionData.endTime);
    console.log('보정된 endTime:', endTimeFormatted);
  }


    const auctionItem = {
      name: auctionData.name,
      description: auctionData.description,
      sellerId: auctionData.sellerId,
      categoryIds: auctionData.categoryIds,
      startPrice: parseInt(auctionData.startPrice),
      bidUnit: parseInt(auctionData.bidUnit),
      address: auctionData.address || '서울특별시 강남구 테헤란로 123',
      latitude: auctionData.latitude || 37.501276,
      longitude: auctionData.longitude || 127.039602,
      endTime: endTimeFormatted,
    };

    const auctionBlob = new Blob([JSON.stringify(auctionItem)], {
      type: 'application/json',
    });

    formData.append('auction_item', auctionBlob);

    // 이미지 파일 추가
    if (images && images.length > 0) {
      images.forEach((image) => formData.append('images', image));
    }

    const BASE_URL = apiClient.defaults?.baseURL || '/api';

    try {
      const response = await fetch(`${BASE_URL}/auctions/register`, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`경매 등록 실패: ${response.status} - ${responseText}`);
      }

      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
    } catch (error) {
      console.error('경매 등록 에러:', error);
      throw error;
    }
  },

  // 경매 목록 조회
  getAuctions: async () => {
    const response = await apiClient.get('/auctions/list');
    return response.data;
  },

  // 경매 상세 조회
  getAuctionDetail: async (auctionId) => {
    try {
      const response = await apiClient.get(`/auctions/${auctionId}/details`);
      const data = response.data;

      const auction = data.auction || {};
      const message = data.message || null;

      return {
        auctionId: auction.id,
        name: auction.name,
        description: auction.description,
        startPrice: Number(auction.startPrice),
        bidUnit: Number(auction.bidUnit),
        auctionStatus: auction.auctionStatus,
        endTime: auction.endTime,
        createdTime: auction.createdTime,
        user: auction.user,
        bids: auction.bids,
        winner: auction.winner,
        message,
        _original: data,
      };
    } catch (error) {
      console.error('❌ 경매 상세정보 불러오기 실패:', error);
      throw error;
    }
  },

  // 지도에서 경매 조회(5km 이내)
  getAuctionsByLocation: async (address) => {
    try {
      const response = await apiClient.get('/auctions/list', {
        params: { address }
      });
      return response.data;
    } catch (error) {
      console.error('❌ 경매 목록(5km 이내) 조회 실패:', error);
      throw error;
    }
  },


  // Top 5 입찰 내역 조회
  getTop5Bids: async (auctionId) => {
    try {
      const res = await apiClient.get(`/bids/top5/${auctionId}`);
      return res.data;
    } catch (error) {
      console.error('❌ Top 5 입찰 내역 조회 실패:', error);
      throw error;
    }
  },

  // 입찰하기 (기존 submitBid와 별도 — 서버에 맞게 /bids/new 사용)
  createBid: async (auctionId, userId, bidPrice) => {
    try {
      const response = await apiClient.post('/bids/new', {
        user: userId,
        auctionId: Number(auctionId),
        bidPrice: Number(bidPrice),
      });
      console.log('✅ 입찰 생성 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 입찰 생성 실패:', error.response?.data || error);
      throw error;
    }
  },

  // (기존 submitBid — 구버전, 필요시 유지)
  submitBid: async (auctionId, bidData) => {
    const response = await apiClient.post('/bids', {
      auctionId,
      bidderId: bidData.bidderId,
      bidPrice: bidData.bidPrice,
      ...bidData,
    });
    return response.data;
  },

  // 보증금 주문 생성 API
  createDepositOrder: async (auctionId, buyerId, sellerId) => {
    try {
      const response = await apiClient.post('/depositOrders/new', {
        auctionId,
        buyerId,
        sellerId,
      });
      return response.data;
    } catch (error) {
      console.error('❌ 보증금 주문 생성 실패:', error.response?.data || error);
      throw error;
    }
  },

  // 경매 마감 상태 확인 (타이머 종료 시 호출)
  checkAuctionStatus: async (auctionId) => {
    try {
      const response = await apiClient.get(`/auctions/${auctionId}/details`);
      const data = response.data;

      // 상태와 낙찰자 정보 정리
      return {
        auctionStatus: data.auction.auctionStatus,
        winner: data.auction.winner,
        message: data.message,
        fullData: data.auction,
      };
    } catch (error) {
      console.error('❌ 경매 상태 확인 실패:', error.response?.data || error);
      throw error;
    }
  },

};

export default auctionService;
