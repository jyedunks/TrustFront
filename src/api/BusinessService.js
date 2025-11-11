// src/api/businessService.js
import apiClient from './Client';

export const businessService = {
  // 사업자 인증 확인
  checkVerification: async (userId) => {
    const response = await apiClient.get('/business/certify', {
      params: { userId }
    });
    return response.data.isVerified || false;
  },

  // 사업자 인증 요청
  requestVerification: async (businessData) => {
    const response = await apiClient.post('/business/verify', businessData);
    return response.data;
  },
};