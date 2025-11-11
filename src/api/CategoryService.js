import apiClient from './Client';

export const categoryService = {
  // 전체 카테고리 목록 불러오기
  getCategories: async () => {
    try {
      const response = await apiClient.get('/category/list');
      return response.data;
    } catch (error) {
      console.error('❌ 카테고리 목록 불러오기 실패:', error);
      throw error;
    }
  },

  // 5km 이내 일반 상품 조회
  getProductsByLocation: async (address) => {
    try {
      const response = await apiClient.get('/product/list', {
        params: { address },
      });
      return response.data;
    } catch (error) {
      console.error('❌ 일반 상품(5km 이내) 조회 실패:', error);
      throw error;
    }
  },

  // 5km 이내 경매 상품 조회
  getAuctionsByLocation: async (address) => {
    try {
      const response = await apiClient.get('/auctions/list', {
        params: { address },
      });
      return response.data;
    } catch (error) {
      console.error('❌ 경매 상품(5km 이내) 조회 실패:', error);
      throw error;
    }
  },
};
