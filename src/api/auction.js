import api from './index';

export const createAuction = (auctionData) => api.post('/auctions', auctionData);
