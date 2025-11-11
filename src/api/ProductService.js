import apiClient from './Client';

export const productService = {
  createSaleProduct: async (productData) => {
    const formData = new FormData();

    const itemData = {
      title: productData.title,
      price: Number(productData.price),
      description: productData.description,
      sellerId: localStorage.getItem('userId') || 'test-user-id',
      categoryIds: [productData.category],
      address: productData.address || '서울특별시 강남구 강남대로 123',
      latitude: productData.latitude || 37.497,
      longitude: productData.longitude || 127.027,
    };

    const productBlob = new Blob([JSON.stringify(itemData)], {
      type: 'application/json',
    });
    formData.append('product_item', productBlob);

    // 이미지 파일 추가
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => formData.append('images', image));
    }

    const BASE_URL = apiClient.defaults?.baseURL || '/api';

    try {
      const response = await fetch(`${BASE_URL}/product/register`, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`물품 등록 실패: ${response.status} - ${responseText}`);
      }

      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
    } catch (error) {
      console.error('물품 등록 에러:', error);
      throw error;
    }
  },
};
