// src/api/item.js
import api from './index';

export const fetchItems = () => api.get('/items');
export const fetchItemById = (id) => api.get(`/items/${id}`);
export const fetchMyItems = () => api.get('/items/mine');
export const createItem = (itemData) => api.post('/items', itemData);